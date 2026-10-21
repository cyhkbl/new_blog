class DataFetcher {
    constructor() {
        // 参考站点用 OpenCC 把简体查询再转一份港繁，iTunes 港区对繁体命中率更高。
        // 脚本没加载成功时退化成原样返回，不影响搜索。
        this.toHongKongTraditional = window.OpenCC?.Converter
            ? window.OpenCC.Converter({ from: 'cn', to: 'hk' })
            : (text) => text;
    }

    /**
     * 搜索 iTunes。接口不需要 key，每条结果自带 artworkUrl100，比 Last.fm 靠谱：
     * Last.fm 的公共 demo key 会限流，而且不少中文歌的 album 是 [unknown]、封面全是空串。
     *
     * @private
     * @param {string} term
     * @param {'artistTerm' | 'songTerm' | null} attribute
     * @param {number} limit
     * @returns {Promise<object[]>}
     */
    async searchItunes(term, attribute, limit) {
        const params = new URLSearchParams({
            term,
            country: 'HK',
            media: 'music',
            entity: 'song',
            limit: String(limit),
        });

        if (attribute) {
            params.set('attribute', attribute);
        }

        try {
            const response = await fetch(`https://itunes.apple.com/search?${params}`);

            if (!response.ok) {
                throw new Error(`iTunes Search returned HTTP ${response.status}`);
            }

            const result = await response.json();
            return result?.results || [];
        } catch (error) {
            console.error('iTunes search failed', error);
            return [];
        }
    }

    /**
     * 简体和港繁各查一遍，去重
     *
     * @private
     * @param {string} query
     * @returns {string[]}
     */
    getSearchAliases(query) {
        return [query, this.toHongKongTraditional(query)].filter(
            (value, index, values) => value && values.indexOf(value) === index
        );
    }

    /**
     * @private
     * @param {string} value
     * @returns {string}
     */
    normalize(value) {
        return String(value || '')
            .normalize('NFKC')
            .trim()
            .toLocaleLowerCase();
    }

    /**
     * 按 trackId 去重，没有 trackId 时用「歌手 + 曲名」
     *
     * @private
     * @param {object[]} tracks
     * @returns {object[]}
     */
    deduplicateTracks(tracks) {
        const seen = new Set();

        return tracks.filter((track) => {
            const key = track.trackId
                ? String(track.trackId)
                : `${this.normalize(track.artistName)}|${this.normalize(track.trackName)}`;

            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    /**
     * @private
     * @param {object} track
     * @param {Set<string>} normalizedAliases
     * @returns {boolean}
     */
    matchesTrackTitle(track, normalizedAliases) {
        const title = this.normalize(track.trackName);
        return [...normalizedAliases].some((alias) => title.includes(alias));
    }

    /**
     * 把 iTunes 结果转成 Song 认识的形状（沿用原来的 album.image 结构）
     *
     * @private
     * @param {object} track
     * @returns {Song}
     */
    toSong(track) {
        const artwork = String(track.artworkUrl100 || '').replace(
            /\d+x\d+bb/,
            '600x600bb'
        );
        const images = artwork ? [0, 1, 2, 3].map(() => ({ '#text': artwork })) : [];

        return new Song({
            name: track.trackName,
            duration: track.trackTimeMillis,
            artist: { name: track.artistName },
            album: { image: images },
        });
    }

    /**
     * 搜歌。默认 general 模式：先要歌手精确命中的，再补曲名命中的。
     *
     * @param {string} query
     * @param {number} limit
     * @param {'general' | 'song' | 'artist'} mode
     * @returns {Promise<Song[]>}
     */
    async getSongInfos(query, limit = 1, mode = 'general') {
        const aliases = this.getSearchAliases(query);
        const normalizedAliases = new Set(aliases.map((alias) => this.normalize(alias)));
        const broadLimit = Math.min(Math.max(limit * 8, limit), 50);
        let tracks = [];

        if (mode === 'song') {
            const resultSets = await Promise.all(
                aliases.map((alias) => this.searchItunes(alias, 'songTerm', broadLimit))
            );
            tracks = this.deduplicateTracks(resultSets.flat())
                .filter((track) => this.matchesTrackTitle(track, normalizedAliases))
                .slice(0, limit);
        } else if (mode === 'artist') {
            const resultSets = await Promise.all(
                aliases.map((alias) => this.searchItunes(alias, 'artistTerm', limit))
            );
            const candidates = this.deduplicateTracks(resultSets.flat());
            const exact = candidates.filter((track) =>
                normalizedAliases.has(this.normalize(track.artistName))
            );
            tracks = (exact.length ? exact : candidates).slice(0, limit);
        } else {
            const [artistSets, songSets] = await Promise.all([
                Promise.all(
                    aliases.map((alias) => this.searchItunes(alias, 'artistTerm', limit))
                ),
                Promise.all(
                    aliases.map((alias) => this.searchItunes(alias, 'songTerm', broadLimit))
                ),
            ]);
            const artistTracks = this.deduplicateTracks(artistSets.flat()).filter((track) =>
                normalizedAliases.has(this.normalize(track.artistName))
            );

            tracks = this.deduplicateTracks([
                ...artistTracks,
                ...this.deduplicateTracks(songSets.flat()).filter((track) =>
                    this.matchesTrackTitle(track, normalizedAliases)
                ),
            ]).slice(0, limit);
        }

        // 「歌手 + 曲名」这种拼在一起的查询，加了 attribute 反而容易搜不到，
        // 上面一条都没捞到时再用不限字段的普通搜索兜一次。
        if (tracks.length === 0) {
            tracks = this.deduplicateTracks(
                await this.searchItunes(query, null, limit)
            ).slice(0, limit);
        }

        return tracks.map((track) => this.toSong(track));
    }

    /**
     * Searches for song lyrics on lrclib
     *
     * @private
     * @param {string} artistName
     * @param {string} trackName
     * @returns {object} song lyrics object
     */
    async getSongLyrics(artistName, trackName) {
        const items = await this.searchLyrics(`${artistName} ${trackName}`);

        if (items.length > 0) {
            return this.pickLyrics(items, trackName);
        }

        // 有些条目的 artist 是一整句描述（合辑、合集），拼出来的查询必然搜不到，
        // 退一步只按歌名再查一次。
        if (artistName) {
            const byTrackName = await this.searchLyrics(trackName);

            if (byTrackName.length > 0) {
                return this.pickLyrics(byTrackName, trackName);
            }
        }

        return null;
    }

    /**
     * Calls lrclib's search endpoint. Always resolves to an array: a 5xx/429
     * answer or a non-JSON body must not break the wizard, and a transient
     * failure gets one retry.
     *
     * @private
     * @param {string} query
     * @returns {Promise<object[]>}
     */
    async searchLyrics(query) {
        for (let attempt = 0; attempt < 2; attempt++) {
            try {
                const response = await fetch(
                    `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`,
                    {
                        method: 'GET',
                    }
                );

                if (response.ok) {
                    const result = await response.json();

                    return Array.isArray(result) ? result : [];
                }
            } catch (error) {
                // 网络错误也走下面的重试
            }

            if (attempt === 0) {
                await new Promise((resolve) => setTimeout(resolve, 700));
            }
        }

        return [];
    }

    /**
     * Picks the result whose track name matches, falling back to the first one.
     *
     * @private
     * @param {object[]} items
     * @param {string} trackName
     * @returns {object | null}
     */
    pickLyrics(items, trackName) {
        const wanted = trackName.toLowerCase().trim();
        const exact = items.find(
            (data) => (data?.trackName ?? '').toLowerCase().trim() === wanted
        );

        return exact ?? items[0] ?? null;
    }
}
