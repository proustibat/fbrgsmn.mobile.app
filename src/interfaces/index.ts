export interface ICoverSong {
    jpg: string;
    svg: string;
}
export interface ISong {
    cover: ICoverSong;
    title: string;
    artist: string;
    track: string;
}

export interface IUrlArchivesParams {
    count: string;
    page: string;
}
export interface IUrlArchives {
    baseUrl: string;
    params: IUrlArchivesParams;
}
