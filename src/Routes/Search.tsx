import { useLocation } from "react-router-dom";
/* https://developers.themoviedb.org/3/search/search-movies
   > https://api.themoviedb.org/3/search/movie?api_key=e7a6b4de55b190b9bd44f056560c7e68&language=en-US&query=Top%20Gun&page=1&include_adult=false&region=kr
   > Top Gun: id - 361743  
*/
export default function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get('keyword')
  
  return null;
}