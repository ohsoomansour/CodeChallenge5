import styled from "styled-components";
import TopRatedMovies from "./TopRatedMovies";
import LatestMovies from "./LatestMovies";
import UpComingMovies from "./UpComingMovies";

const Wrapper = styled.div`
  height:100vh;
  background: black;
  width:100vw;
  position:relative;
  top:70px;
`;

export default function Home() {
  

  return (
  <Wrapper >
    <TopRatedMovies />
    <UpComingMovies />
    <LatestMovies />
  </Wrapper>
    
  )
}

