import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll  } from "framer-motion";
import { useQuery } from "react-query";
import { getLatestShowTv } from "../../api";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
import { makeImagePath } from "../../utils";

const Wrapper = styled.div`
  position:relative;
  background-color:black;
  top:1250px;
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
interface INetworks{
  id: number;
  name: string;
  logo_path: string;
  origin_country: string;
}

export interface ILatestTv {
  id:number;
  overview:string | null;
  poster_path:string | null;
  backdrop_path:string | null;
  status:string;
  next_episode_to_air:{
    air_date: string;
    episode_number: number;
    id: number;
    name: string;
    overview: string;
    
  }
  networks:INetworks[];

  name:string;
}

export default function LatestTvShow() {

  const history = useHistory()
  const onBoxClicked = (movieId:number) => {
    history.push(`/movies/${movieId}`);
  };
  const bigMovieMatch = useRouteMatch<{movieId:string}>("/movies/:movieId")
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((prev) => !prev)
  const increaseIndex = () => {
    if(LatestTvData){
      if(leaving)return;
      toggleLeaving(); //true ?????? > index 0?????? '1'??? ????????? > false 

      setIndex((prev) => (prev + 1) );
    }
  }
  const {data:LatestTvData, isLoading:LatestLoading} = useQuery<ILatestTv>(
    ["Tv", "LatestTv"],
    getLatestShowTv)
    //console.log(LatestTvData, LatestLoading );
    
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
            {LatestTvData?(
              <Box 
                layoutId={LatestTvData.id + ""}
                key={LatestTvData.id}
                onClick={() => onBoxClicked(LatestTvData.id)}
                variants={BoxVariants} 
                initial="normal"
                whileHover="hover"
                transition={{ type: "tween"}}
                bgPhoto={makeImagePath(LatestTvData.backdrop_path as any, "w500")} 
              >
                <Info variants={infoVariants} > 
                  <h4> {LatestTvData.name} </h4> 
                </Info> 
              </Box>
                
            ):null}
            
          </Row>
        </AnimatePresence>
        
      </Slider>
    </>  
      )}
    </Wrapper>  
    )
  }

