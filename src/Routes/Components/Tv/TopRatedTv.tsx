import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll  } from "framer-motion";
import { useQuery } from "react-query";
import { getTopRatedTv} from "../../api";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../../utils";


const Wrapper = styled.div`
  position:relative;
  background-color:black;
  top:250px;
`

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Slider = styled.div`
  position: relative;
  
  
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute;
  left:0;
  right:0;
  width: 96%;
  margin:0 10;
`;
const NexBtn = styled.button`
  position:relative;
  width:50px;
  height:300px;
  cursor: pointer;
  font-size:45px;
`

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
  width: 40vw; 
  height: 80vh;
  background-color: ${(props) => props.theme.black.lighter};
  overflow: hidden;
  border-radius: 15px;
  position:relative;
  margin: auto auto;
`;
const BigCover = styled.div`
  width: 100%;
  height: 200px;
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
    backdrop_path:string;
    id:number;
    name: string;
    original_name: string;
    overview: string;
    popularity: number;
    poster_path: string;
    vote_average: number;
    vote_count: number;
    
}
interface IAiringToday{
  results:IResults[]
}


const offset = 6;
export default function TopRatedTv() {
  
  const history = useHistory()
  const onBoxClicked = (movieId:number) => {
    history.push(`/movies/${movieId}`);
  };
  const bigMovieMatch = useRouteMatch<{movieId:string}>("/movies/:movieId")
  const { scrollY  } = useViewportScroll();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev)
  const increaseIndex = () => {
    if(TopRatedData){
      if(leaving)return;
      toggleLeaving(); //true 상태 > index 0에서 '1'로 바뀌면 > false 
      const totalMovies = TopRatedData.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1) );
    }
  }
  const {data:TopRatedData, isLoading:TopRatedLoading} = useQuery<IAiringToday>(
    ["TvShow", "TopRated"],
    getTopRatedTv)

  const onOverlayClick = () => history.goBack(); // history.push("/")
  const clickedMovie = bigMovieMatch?.params.movieId && TopRatedData?.results.find(movie => movie.id +"" === bigMovieMatch.params.movieId);
    return(
    <Wrapper>
      { TopRatedLoading ? (<Loader>loading...</Loader>) : (
    <>  
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
            {TopRatedData?.results.slice(index*offset, index*offset+offset).map((movie) => (
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
                  <h4> {movie.name} </h4> 
                </Info> 
              </Box>
                
            ))}
            
          </Row>
        </AnimatePresence>
        <NexBtn onClick={increaseIndex}>◀</NexBtn>     
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
              style={{ bottom: scrollY.get() - 100}}
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
                <BigTitle>{clickedMovie?.original_name}</BigTitle>
                <BigOverview>{clickedMovie.overview}</BigOverview>
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