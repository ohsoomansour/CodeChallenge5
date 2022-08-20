import styled from "styled-components";
import AiringTodayTv from "./AiringTodayTv";
import LatestTvShow from "./LatestTv";
import PopularTv from "./PopularTv";
import TopRatedTv from "./TopRatedTv";

const Wrapper = styled.div`
  display:flex;
  flex-direction:column;
  height:350vh;
  
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