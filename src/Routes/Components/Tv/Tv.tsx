import styled from "styled-components";
import AiringTodayTv from "./AiringTodayTv";
import LatestTvShow from "./LatestTv";
import PopularTv from "./PopularTv";
import TopRatedTv from "./TopRatedTv";

const Wrapper = styled.div`
  height:100vh;
  background: black;
  width:100vw;
  position:relative;
  top:70px;

`

export default function Tv() {
  return (
    <Wrapper>
      <PopularTv />
      <AiringTodayTv />
      <TopRatedTv />
      <LatestTvShow />  
    </Wrapper>

    
  )
};