import { useQuery } from "react-query";
import styled from "styled-components";
import getMovies, { getTopRatedMoives, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";
import {motion, AnimatePresence, useViewportScroll, useScroll } from "framer-motion";
import { useRef, useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import TopRatedMovies from "./Movie/TopRatedMovies";
import LatestMovies from "./Movie/LatestMovies";
import UpComingMovies from "./Movie/UpComingMovies";

/*쿼리사용
  설정1.:[index.tsx] import {QueryClient, QueryProvider } from "react-query";
  설정2. const client = new QueryClient();  "캐싱관리를 위해 인스턴스를 생성"
        <QueryClientProvider client={client}>
          <App />
        </QueryClientProvider>
  const { data, isLoading } = useQuery(["Movie", "nowPlaying" ],getMovie )
  {isLoading ? Loading... : (data?.results.map(movie => (
    <Box key={movie.id} index={index}  />
    ))}
*/
/*
🔷(on the home) page implement sliders for: Latest movies, Top Rated Movies and Upcoming Movies.
*/

const Wrapper = styled.div`
  background: black;
  height:450vh;
  position:relative;
  top:70px;
`;
const Banner = styled.div<{bgPhoto:string}>`
  height:80vh;
  display:flex;
  flex-direction:column;
  justify-content:center;
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
  
`;
const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;
  margin-bottom: 50px;
  position: absolute; 
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
//화면크기: 콘솔창에서 window.outerWidth() //2560

//Box컴포넌트의 BoxVariants >> 자동으로 info컴포넌트에 상속됨 따라서, 별도의 ifoVariants를 만들어서 별도 설정 
const BigMovie = styled(motion.div)` 
  position: absolute; 
  top:0;
  width: 40vw; 
  height: 80vh;

  background-color: ${(props) => props.theme.black.lighter};
  overflow: hidden;
  border-radius: 15px;
`;
const BigCover = styled.div`
  width: 100%;
  height: 70%;;
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
//Set type to "tween" to use a duration-based animation 
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
const offset = 6;

export default function Home() {
  const history = useHistory();
  //console.log(history);
  const location = useLocation()
  //console.log(location)
  const onBoxClicked = (movieId:number) => {
    history.push(`/movies/${movieId}`);
  };
  const bigMovieMatch = useRouteMatch<{movieId:string}>("/movies/:movieId")

  const ref = useRef(null)
  const { scrollY, scrollYProgress } = useScroll({
    target:ref,
    offset: ["start end", "end end"]
  });
  
  const {data:nowData, isLoading:nowLoading} = useQuery<IGetMoviesResult>(
    ["movies", "nowPlaying"],
     getMovies);

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev)
  const increaseIndex = () => {
    if(nowData){
      if(leaving)return;
      toggleLeaving(); //true 상태 > index 0에서 '1'로 바뀌면 > false 
      const totalMovies = nowData.results.length - 1;
      const maxIndex = Math.ceil(totalMovies / offset);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1) );
    }
  }
  
  const onOverlayClick = () => history.goBack(); // history.push("/")
  const clickedMovie = bigMovieMatch?.params.movieId && nowData?.results.find(movie => movie.id +"" === bigMovieMatch.params.movieId);
   //find 는 판별 함수를 만족하는 첫 번째 요소의 값을 반환

  return (
    <Wrapper >
      {nowLoading ? (<Loader>Loaidng...</Loader>):(
    <>
      <Banner  onClick={increaseIndex} bgPhoto={makeImagePath(nowData?.results[0].backdrop_path || "")}>
        <Title>{nowData?.results[0].title}</Title>
        <Ovierview>{nowData?.results[0].overview}</Ovierview>
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
            
            {nowData?.results.slice(1).slice(index*offset, index*offset+offset).map((movie) => (
            /*🔷'key'를 변경 바꾸면 React js는 component를 re-render  
                   > 이전 component를 삭제로 인식, 새 것을 보여주는 곳에는 initial, animate, exit 모두 실행! */  
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
              ref={ref}
              layoutId={bigMovieMatch.params.movieId } 
              style={{ top: scrollY.get() }}
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
                <BigTitle>{clickedMovie?.title}</BigTitle>
                <BigOverview>{clickedMovie.overview}</BigOverview>
             </>
            )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
       

      
      
    </>  
  )}   
    <TopRatedMovies />
    <UpComingMovies />
    <LatestMovies />
    </Wrapper>
    
  )
}

