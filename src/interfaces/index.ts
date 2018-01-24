export interface ICoverSong {
    cover: {
        jpg: string,
        svg: string
    };
}
export interface ISong {
    cover: ICoverSong;
    title: string;
    artist: string;
    track: string;
}
