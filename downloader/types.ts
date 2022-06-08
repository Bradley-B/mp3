interface SongMetadataEntry {
    id: string,
    artist: string,
    title: string,
    album: string,
    date: string,
    trackNumber: number | undefined,
    totalTracks: number | undefined,
    artworkUrl: string
}

export { SongMetadataEntry }