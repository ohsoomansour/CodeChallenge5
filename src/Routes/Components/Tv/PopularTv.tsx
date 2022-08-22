import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { useQuery } from "react-query";
import {  getPopularShowTv} from "../../api";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../../utils";

const Wrapper = styled.div`
  position:relative;
`
const Banner = styled.div<{bgPhoto:string}>`
  height:60vh;
  z-index:0;
  display:flex;
  flex-direction:column;
  justify-content:flex-end;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)) ,url(${(props) => props.bgPhoto});
  backgound-size:cover;
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
  top:50px;
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  position: absolute; 
  left:0;
  right:0;
  margin:0 auto;
  width: 96%;
`;
const NexBtn = styled.button`
  position:relative;
  width:50px;
  height:300px;
  cursor: pointer;
  font-size:45px;
`
const Box = styled(motion.div)<{bgPhoto:string}>`
  padding-top:100px;
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
//translate3d(x,y,z):	현재의 위치에서 해당 요소를 주어진 x축, y축과 z축의 거리만큼 이동시킴.
const BigMovie = styled(motion.div)`
  width: 40vw;
  height: 60vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  z-index:500;
`;

const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 35px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 15px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
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
interface IPopular{
results:IResults[]
}


const offset = 6;
export default function PopularTv() {
  
  const history = useHistory()
  const onBoxClicked = (movieId:number) => {
    history.push(`/movies/${movieId}`);
  };
  const bigMovieMatch = useRouteMatch<{movieId:string}>("/movies/:movieId")
  const { scrollY }  = useViewportScroll();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev)
  const increaseIndex = () => {
    if(PopularData){
      if(leaving)return;
      toggleLeaving(); //true 상태 > index 0에서 '1'로 바뀌면 > false 
      const totalMovies = PopularData.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1) );
    }
  }
  const {data:PopularData, isLoading:PopularLoading} = useQuery<IPopular>(
    ["TvShow", "Popular"],
    getPopularShowTv)
  
  const onOverlayClick = () => history.goBack(); // history.push("/")
  const clickedMovie = bigMovieMatch?.params.movieId && PopularData?.results.find(movie => movie.id +"" === bigMovieMatch.params.movieId);
    return(
    <Wrapper>
      { PopularLoading ? (<Loader>loading...</Loader>) : (
    <>  
     <Banner bgPhoto={makeImagePath(PopularData?.results[0].poster_path|| "")} >    
      <Title>{PopularData?.results[0].original_name}</Title>
      <Ovierview>{PopularData?.results[0].overview}</Ovierview>
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
            {PopularData?.results.slice(1).slice(index*offset, index*offset+offset).map((movie) => (
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