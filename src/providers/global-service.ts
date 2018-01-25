import { Injectable } from '@angular/core';
import { ICoverSong, IUrlArchives, IUrlArchivesParams, PostType } from '../interfaces';

@Injectable()
export class GlobalService {
    public static DEV_MODE = true;

    public static BASE_URL_API_PROD = 'http://faubourgsimone.paris';
    public static BASE_URL_API_DEV = 'http://faubourgsimone.local';
    public static BASE_URL = GlobalService.DEV_MODE ? GlobalService.BASE_URL_API_DEV : GlobalService.BASE_URL_API_PROD;

    public static URL_INFO_DEV = 'assets/config.json';
    public static URL_INFO_PROD = 'http://faubourgsimone.paris/ionic-app/info.json';

    public static DEFAULT_URL_STREAMING = 'http://91.121.65.131:8000/;';
    public static URL_API_COVERS = 'http://ks25555.kimsufi.com/fsapi/cacheapi.json';

    public static COVER_DEFAULT: ICoverSong = {
        jpg: 'assets/images/cover-default.jpg',
        svg: 'assets/images/cover-default.svg'
    };
    public static COVER_DEFAULT_FRIDAY_WEAR: ICoverSong = {
        jpg: 'assets/images/cover-friday-wear.jpg',
        svg: 'assets/images/cover-friday-wear.svg'
    };
    public static COVER_DEFAULT_NOUVEAUTE: ICoverSong = {
        jpg: 'assets/images/cover-news.jpg',
        svg: 'assets/images/cover-news.svg'
    };
    /**
     *
     * @param {PostType} postType
     * @returns {IUrlArchives}
     * @example `GlobalService.GET_URL_ARCHIVES( PostType.pola )`
     */
    public static GET_URL_ARCHIVES( postType: PostType ): IUrlArchives {
        // post type for casque category in our wordpress api is called 'nouveaute'
        const typeKey = postType === PostType.casque ? 'nouveaute' : PostType[ postType ];
        return {
            baseUrl: `${GlobalService.BASE_URL}/api/get_posts/?post_type=${ typeKey }`,
            params: GlobalService.URL_ARCHIVES_PARAMS
        };
    }

    public static URL_CALEPIN = `${GlobalService.BASE_URL}/wp-json/wp/v2/calepin/`;
    public static URL_CASQUE = `${GlobalService.BASE_URL}/wp-json/wp/v2/nouveaute/`;
    public static URL_CASQUE_FIELDS = `${GlobalService.BASE_URL}/wp-json/acf/v2/nouveaute/`;

    // TODO translate
    public static loadingMsgPosts: string[] = [
        'Tout doux beau prince !',
        'Patience beauté !',
        'Quelques secondes minouche !',
        'Effeuillage imminent.',
        'On prépare les magrets.',
        'On vous beurre les tartines.',
        'Bien attend qui parratend.',
        'Patience et longueur de temps font plus que force ni que rage.',
        'Prends patience, tu verras des miracles',
        'Qui va piano va sano',
        'Goutte à goutte on emplit la cuve.',
        'Patience est mère de toutes les vertus',
        'Oui, oui, un p’tit instant voulez-vous'
    ];
    public static loadingMsgRadio: string[] = [
        'Paris ne s\'est pas faite en un jour !',
        'En voiture Simone !',
        'Préparation du café !',
        'Préchauffage du transistor !',
        'Mixage du son et de l\'avoine en cours !',
        'Déploiement de l\'antenne !',
        'On cherche la prise Jack !',
        'On vous envoie la sauce !',
        'Propagation des ondes',
        'Recherche de la ionosphere',
        'Oui, oui, un p’tit instant voulez-vous',
        'Patience est mère de toutes les vertus'
    ];
    public static getRandomMessageIn( messages: string[] ) {
        return messages[ Math.floor( Math.random() * ( messages.length - 1 ) ) ];
    }

    private static URL_ARCHIVES_PARAMS: IUrlArchivesParams = {
        count: '&count=',
        page: '&page='
    };
}
