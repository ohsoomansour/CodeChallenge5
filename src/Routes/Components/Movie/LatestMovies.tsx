import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll  } from "framer-motion";
import { useQuery } from "react-query";
import { getLatestMovies } from "../../api";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../../utils";

const Wrapper = styled.div`
  position:relative;
  top:250px;
  height:30%;
`
const Loader = styled.div`
  height: 10vh;
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
  position: relative; 
  margin-bottom: 50px;
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
  position: fixed;
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

export interface ILatestMovies {
  id:number;
  overview:string;
  backdrop_path:string | null;
  poster_path:string | null;
  status:string;
  name:string;
  
}

export default function LatestMovies() {

  const history = useHistory()
  const onBoxClicked = (movieId:number) => {
    history.push(`/movies/${movieId}`);
  };
  const bigMovieMatch = useRouteMatch<{movieId:string}>("/movies/:movieId")
  const { scrollY } = useViewportScroll();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev)
  const increaseIndex = () => {
    if(LatestData){
      if(leaving)return;
      toggleLeaving(); //true 상태 > index 0에서 '1'로 바뀌면 > false 

      setIndex((prev) => (prev + 1) );
    }
  }
  const {data:LatestData, isLoading:LatestLoading} = useQuery<ILatestMovies>(
    ["movies", "Latest"],
    getLatestMovies)
  //console.log(LatestData);
  const onOverlayClick = () => history.goBack(); // history.push("/")
  const clickedMovie = bigMovieMatch?.params.movieId   
    return(
    <Wrapper onClick={increaseIndex}>
      { LatestLoading ? (<Loader>loading...</Loader>) : (
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
            {LatestData?(
              <Box 
                layoutId={LatestData.id + ""}
                key={LatestData.id}
                onClick={() => onBoxClicked(LatestData.id)}
                variants={BoxVariants} 
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween"}}
                bgPhoto={makeImagePath(LatestData.backdrop_path as any, "w500")} 
              >
                <Info variants={infoVariants} > 
                  <h4> {LatestData.name} </h4> 
                </Info> 
              </Box>
                
            ):null}
            
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
              style={{ bottom: scrollY.get() - 700 }}
            >
            {clickedMovie &&( 
              <>
                <BigCover
                  style={{
                    backgroundImage: `linear-gradient(to top, black, transparent),url(${makeImagePath(
                      "",
                       "w500"
                    )})`
                  }}
                />
                <BigTitle>{LatestData?.name}</BigTitle>
                <BigOverview>{LatestData?.overview}</BigOverview>
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