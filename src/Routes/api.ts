/*#8.5 Home Screen part One
  1. themoviedb, https://www.themoviedb.org/settings/api?language=ko 
    >> key - "e7a6b4de55b190b9bd44f056560c7e68"  
  2. API 페이지 ※https://developers.themoviedb.org/3/movies/get-now-playing
  3. Invalid key 메세지 정상 vs 비정상 비교 
  비정상:https://api.themoviedb.org/3/movie/now_playing?api_key=e7a6b4de55b190b9bd44f056560c7e68%20%20&language=en-US&page=1&region=kr
  정상:https://api.themoviedb.org/3/movie/now_playing?api_key=e7a6b4de55b190b9bd44f056560c7e68&language=en-US&page=1&region=kr
    >> ★주의:Try it out 기입란에 '공백'이 있을시에 %20%20 추가됨! 

  4. image받기: GETTING STARTED > Images 
  > 예시1(w500사이즈): https://image.tmdb.org/t/p/w500/62HCnUTziyWcpDaBO2i1DX17ljH.jpg(포스터패트)
  > 예시2(풀사이즈): https://image.tmdb.org/t/p/original/62HCnUTziyWcpDaBO2i1DX17ljH.jpg(포스터패트)
  
  🔷On the / (home) page implement sliders for: Latest movies, Top Rated Movies and Upcoming Movies.
  */

  interface IMovie {
    backdrop_path: string;
    id: number;
    overview:string;
    poster_path:string;
    title:string;
  }
  export interface IGetMoviesResult {
    dates:{
      maximum:string;
      minumum:string;
    },
    page:number;
    results: IMovie[];
    total_pages:number;
    total_results:number;
  } 

  interface ITRM{
    backdrop_path: string;
    id:number;
    overview:string;
    poster_path:string;
    title:string;
  }
  export interface ITopRatedMovies{
    dates:{
      maximum:string;
      minumum:string;
    },
    page:number;
    results:ITRM[]
    total_pages:number;
    total_results:number;
  }

  const API_KEY ="e7a6b4de55b190b9bd44f056560c7e68"
  const BASE_PATH = "https://api.themoviedb.org/3"
 //🔹On the / (home) page implement sliders for: Latest movies, Top Rated Movies and Upcoming Movies.
  export default function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
      (reponse) => reponse.json()
    )
  } 
  

  export function getLatestMovies() {
    return fetch(`${BASE_PATH}/movie/latest?api_key=${API_KEY}`).then(
      (response) => response.json()
    )
  } 
  export function getTopRatedMoives() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
      (response) => response.json()
    )
  } 
  
  export function getUpcomingMovies() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
      (response) => response.json()
    )
  }

  //🔹On the /tv page implement sliders for: Latest Shows, Airing Today, Popular, Top Rated.

  export function getLatestShowTv(){
    return fetch(`${BASE_PATH}/tv/latest?api_key=${API_KEY}`).then(
      (repsonse) => repsonse.json()
    )
  }
  export function getAiringTodayShowTv(){
    return fetch("https://api.themoviedb.org/3/tv/airing_today?api_key=e7a6b4de55b190b9bd44f056560c7e68&language=en-US&page=1").then(
      (repsonse) => repsonse.json()
    )
  }
  export function getPopularShowTv(){
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then(
      (response) => response.json()
    )
  }

  export function getTopRatedTv(){
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
      (response) => response.json()
    )
  }
  //https://api.themoviedb.org/3/search/multi?api_key=e7a6b4de55b190b9bd44f056560c7e68&language=en-US&query=dune&page=1&include_adult=false

interface IMultiSearch{
  keyword:string | null;
}  
export function getMultiSearch({keyword}:IMultiSearch){
  return fetch(`${BASE_PATH}/search/multi?api_key=${API_KEY}&language=en-US&query=${keyword}`).then(
    (repsponse) => repsponse.json()
  )
}
  