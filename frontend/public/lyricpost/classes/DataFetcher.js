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

        const response = await fetch(searchUrl);

        const result = await response.json();
        const tracks = result?.results?.trackmatches?.track || [];

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
                    return new Song(infoResult.track);
                }
            } catch (err) {
                console.error('Failed to fetch track info for', searchTrack.name, err);
            }
            return null;
        }));

        return songs.filter(song => song !== null);
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
