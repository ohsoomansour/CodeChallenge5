import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll, useScroll  } from "framer-motion";
import { useQuery } from "react-query";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "./utils";
import { getMultiSearch } from "./api";
import { useRecoilState } from "recoil";
import { SearchAtom } from "../recoil";
const Wrapper = styled.div`
  position:relative;
  top:100px;
`
const Banner = styled.div<{bgPhoto:string}>`
  position:relative;
  top:20px;
  height:100vh;
  display:flex;
  flex-direction:column;
  justify-content:flex-end;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)) ,url(${(props) => props.bgPhoto});
  backgound-size:cover;
  background-position:center center;
`;
const Title = styled.h2`
  font-size: 60px;
  margin-bottom: 10px;
`;
const Ovierview = styled.p`
  font-size: 36px;
  width: 50%;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Slider = styled.div`
  position: relative;
  top:-800px;
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute; 
  top:-200px;
  margin-bottom: 50px;
  
  width: 100%;
`;

const Box = styled(motion.div)<{bgPhoto:string}>`
  height: 300px;
  background-color: white;
  background-image:url(${(props) => props.bgPhoto});
  background-size:cover;
  color: ${(props) => props.theme.white.lighter};
  background-position: center center;
  font-size:50px;
  &:first-child{
    transform-origin: center left;
  }
  &:last-child{
    transform-origin: center right;
  }
  cursor: pointer;
`;

const Info = styled(motion.div)`
  padding: 20px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position:absolute;
  width: 100%;
  height:30%;
  bottom:0;
  h4{
    text-align:center;
    font-size:30px;
    font-weight:900;
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top:0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity:0;
`;
const BigMovie = styled(motion.div)` 
  position: absolute; 
  width: 40vw; 
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.black.lighter};
  overflow: hidden;
  border-radius: 15px;
`;
const BigCover = styled.div`
  width: 100%;
  height: 70%;
  background-size: cover;
  background-position:center center ;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size:40px;
  top: -80px;
  position: relative;
  padding:20px;
`;
const BigOverview = styled.p`
  color: ${(props => props.theme.white.lighter)};
  position: relative;
  top: -10px;
  padding: 20px;
  font-size: 25px;
`;

const BoxVariants = {
  normal:{
    scale: 1,
  },
  hover: {
    zIndex:99,
    scale:1.3,
    y:-80,
    transition:{
      type:"tween",
      duration: 0.1, 
      delay: 0.5,
    }
  }
}
const rowVariants = {
  hidden:{
    x: window.outerWidth + 10,
  },
  visible:{
    x: 0,
  },
  exit:{
    x:-window.outerWidth -10 ,
  },
}
const infoVariants ={
  hover:{
    opacity:1,
    transition:{
      type:"tween",
      duration: 0.1, 
      delay: 0.5,
    }
  }
}

interface IResults{
  adult:boolean;
  backdrop_path:string;
  id: number;
  media_type: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  vote_average: number;
  vote_count: 443
}
interface IMultiSearch{
  results:IResults[]
}

/* https://developers.themoviedb.org/3/search/search-movies
   > https://api.themoviedb.org/3/search/movie?api_key=e7a6b4de55b190b9bd44f056560c7e68&language=en-US&query=Top%20Gun&page=1&include_adult=false&region=kr
   > Top Gun: id - 361743  
*/
/*#8.14 Search Redirect 4:24 ~ 
  const location = useLocation()
  >console.log(location)
    hash: ""
    key: "qo8s8m"
    pathname: "/search"
    search: "?keyword=topgun"
    state: undefined
   ????Search?????????????????? location.search??? ??????! > (JavaScript)URLsearchParams??? ??????
   ???) const search = new URLSearchParams("?keyword=luck&region=kr")
      > search.get("region") > 'kr'
*/

const offset = 6;
export default function Search() {
  const location = useLocation();
  //console.log(location)
  const keyword = new URLSearchParams(location.search).get("keyword")
  //console.log(keyword)
  const [searchKey, useSearchKey] = useRecoilState(SearchAtom);
  useSearchKey(keyword + "")
  //console.log(searchKey)
  const history = useHistory();
  const onBoxClicked = (movieId:number) => {
    history.push(`/movies/${movieId}`);
  };

  const { scrollY, scrollYProgress } = useScroll();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev)
  const increaseIndex = () => {
    if(SearchData){
      if(leaving)return;
      toggleLeaving(); //true ?????? > index 0?????? '1'??? ????????? > false 
      const totalMovies = SearchData.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1) );
    }
  }
  const {data:SearchData, isLoading:SearchLoading} = useQuery<IMultiSearch>(
    ["Search", "MultiSearch"],
    () => getMultiSearch({keyword}))
    //console.log(SearchData) 
  const onOverlayClick = () => history.goBack(); // history.push("/")
  const bigMovieMatch = useRouteMatch<{movieId:string}>("/movies/:movieId")
  const clickedMovie = bigMovieMatch?.params && 
    SearchData?.results.find(movie => movie.id +"" === bigMovieMatch.params.movieId);
  console.log(clickedMovie, SearchData )//minoin movie id: 438148
  return(
    <Wrapper>
      { SearchLoading ? (<Loader>loading...</Loader>) : (
    <>  
     <Banner onClick={increaseIndex} bgPhoto={makeImagePath(SearchData?.results[0].poster_path|| "")} >    
      <Title>{SearchData?.results[0].title}</Title>
      <Ovierview>{SearchData?.results[0].overview}</Ovierview>
    </Banner> 
      <Slider>
        <AnimatePresence initial={false}  onExitComplete={toggleLeaving}  >
          <Row 
            key={index} 
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration:1  }}
          >
            {SearchData?.results.slice(1).slice(index*offset, index*offset+offset).map((movie) => (
              <Box 
                layoutId={movie.id + ""}
                key={movie.id}
                onClick={() => onBoxClicked(movie.id)}
                variants={BoxVariants} 
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween"}}
                bgPhoto={makeImagePath(movie?.backdrop_path, "w500")} 
              >
                <Info variants={infoVariants} > 
                  <h4> {movie.title} </h4> 
                </Info> 
              </Box>
                
            ))}
            
          </Row>
        </AnimatePresence>
        
      </Slider>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
             onClick={onOverlayClick} 
             animate={{opacity: 1}}
             exit={{opacity: 0}}
            />
            <BigMovie
              layoutId={bigMovieMatch.params.movieId } 
              style={{ top: scrollY.get() + 100 }}
            >
            {clickedMovie &&( 
              <>
                <BigCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                      clickedMovie.poster_path,
                       "w500"
                    )})`
                  }}
                />
                <BigTitle>{clickedMovie?.original_title}</BigTitle>
                <BigOverview>{clickedMovie?.overview}</BigOverview>
             </>
            )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>  
      )}
      
    </Wrapper>  
    )
}   