class DataFetcher {
    constructor() {
    }

    /**
     * Searches for songs on Last.fm
     *
     * @private
     * @param {string} name
     * @param {number} limit
     * @returns {Song[]} an array of Song objects
     */
    async getSongInfos(name, limit = 1) {
        const query = name;

        const apiKey = 'b362b9a7f5f0c5a7f749d568b68bc32a';
        const searchUrl = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(query)}&api_key=${apiKey}&format=json&limit=${limit}`;

        let tracks = [];

        try {
            const response = await fetch(searchUrl);
            const result = await response.json();
            tracks = result?.results?.trackmatches?.track || [];
        } catch (error) {
            console.error('Last.fm search failed', error);
        }

        // Last.fm 用的是公共 demo key，偶尔会限流或者直接连不上。
        // 这时候退回 iTunes 搜索，免得用户看到空白的结果列表。
        if (tracks.length === 0) {
            return this.searchItunes(query, limit);
        }

        const songs = await Promise.all(tracks.map(async (searchTrack) => {
            try {
                const infoUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${apiKey}&artist=${encodeURIComponent(searchTrack.artist)}&track=${encodeURIComponent(searchTrack.name)}&format=json`;
                const infoResponse = await fetch(infoUrl, {
                    headers: {
                        'User-Agent': 'Application LyricPost/1.0 (pogromca.ap@gmail.com)',
                    },
                });
                const infoResult = await infoResponse.json();

                if (infoResult.track) {
                    const song = new Song(infoResult.track);

                    if (!song.albumCoverUrl) {
                        song.albumCoverUrl = await this.getArtworkUrl(
                            searchTrack.artist,
                            searchTrack.name
                        );
                    }

                    return song;
                }
            } catch (err) {
                console.error('Failed to fetch track info for', searchTrack.name, err);
            }
            return null;
        }));

        return songs.filter(song => song !== null);
    }

    /**
     * Last.fm 搜不到时的兜底数据源：iTunes 搜索接口不需要 key，结果自带封面。
     *
     * @param {string} query
     * @param {number} limit
     * @returns {Promise<Song[]>}
     */
    async searchItunes(query, limit = 6) {
        try {
            const params = new URLSearchParams({
                term: query,
                media: 'music',
                entity: 'song',
                limit: String(limit),
                country: 'HK',
            });
            const response = await fetch(
                `https://itunes.apple.com/search?${params}`
            );

            if (!response.ok) {
                return [];
            }

            const result = await response.json();
            const items = Array.isArray(result?.results) ? result.results : [];

            return items.map(
                (item) =>
                    new Song({
                        name: item.trackName,
                        duration: item.trackTimeMillis,
                        artist: { name: item.artistName },
                        album: {
                            image: item.artworkUrl100
                                ? [0, 1, 2, 3].map(() => ({
                                      '#text': item.artworkUrl100.replace(
                                          /\d+x\d+bb/,
                                          '600x600bb'
                                      ),
                                  }))
                                : [],
                        },
                    })
            );
        } catch (error) {
            console.error('iTunes search failed', error);
            return [];
        }
    }

    /**
     * Last.fm 对相当一部分歌（尤其中文歌）没有封面：album 是 [unknown]、image 全是空串，
     * 或者只给一张默认星星图。这种情况下改用 iTunes 的搜索结果补一张，它的
     * artworkUrl100 换掉尺寸后缀就是 600×600，且允许跨域，能直接导出。
     *
     * @param {string} artistName
     * @param {string} trackName
     * @returns {Promise<string | null>}
     */
    async getArtworkUrl(artistName, trackName) {
        try {
            const query = new URLSearchParams({
                term: `${artistName} ${trackName}`,
                media: 'music',
                entity: 'song',
                limit: '5',
                country: 'HK',
            });
            const response = await fetch(
                `https://itunes.apple.com/search?${query}`
            );

            if (!response.ok) {
                return null;
            }

            const result = await response.json();
            const items = Array.isArray(result?.results) ? result.results : [];
            const wanted = trackName.toLowerCase().trim();
            const nameOf = (item) => (item.trackName || '').toLowerCase().trim();
            const match =
                items.find((item) => nameOf(item) === wanted) ||
                items.find((item) => nameOf(item).startsWith(wanted)) ||
                items[0];
            const artwork = match?.artworkUrl100;

            return artwork ? artwork.replace(/\d+x\d+bb/, '600x600bb') : null;
        } catch (error) {
            console.error('Failed to load artwork from iTunes', error);
            return null;
        }
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

        // 部分 Last.fm 条目的 artist 是一整句描述（合辑、合集），拼出来的
        // 查询必然搜不到，退一步只按歌名再查一次。
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
