import React, { useEffect, useRef, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import {BrowserRouter, Switch, Route} from "react-router-dom";
import Home from './Routes/Components/Movie/Home';
import Tv from './Routes/Components/Tv/Tv';
import Search from './Routes/Search';
import Header from './Routes/Components/Header';


/*#Animation - ※https://www.framer.com/motion/
1. box-shadow: x-offset, y-offset, blur(흐릿함), spread, +선택사항으로 color
   rgba: a는 alpha chenner(완전투명:0 ~ 투명도없음:1)
2. create-react-app ver.4 !== framer motion ver.5  >> create-react-app 버전 5로 해결 
  >> craco.config.js: CRACO(Create React App Configuration Override)는 create-react-app의 설정사항을 override할 수 있게 해줌
  >> npm install @craco/craco -save >> craco.config.js 만듬 (#7.1 installation참고)
  >> ★create-react-app은 EcmaScript 자바스크립트 모듈을 이해 하게됨 
#7.4 Variants part Two
  1. CSS - justify-self:center; align-self:center >> 축약표현, place-self: center;  
  2. motion은 Box컴포넌트의 variants를 자식 Circle컴포넌트에 기본 동작으로, 상속시킴  
  3. Orchestration - 
#7.6 Gestures part Two(5:45 ~ )
  1. 특정 Element를 잡을 수 있는 방법
  2. 🪐const biggerBoxRef = useRef(null)과 BiggerBox컴포넌트와 연결되어 있다🪐
      ▶ <BiggerBox ref={biggerBoxRef}
        <Box
          dragCo nstraints={biggerBoxRef}
        />  
        </BiggerBox>
#7.7 MotionValues part One
1. style={{ x }} "스타일이 변경될 때 그 갑솓 변경되는 거다"
2. MotionValue의 변수 x는 React.js에 없다라는 의미
 > 업데이트 될 때마다 리렌더링을 하지 않는다! = Update visual properties without triggering React's render cycle.
 > Motion Values > Overview: Respnding to changes 문서 확인
 
 #7.9 MotionValues part Two - useViewportScroll
 1. 스크롤의 MotionValue를 넘겨줄 거다 
 #7.10 SVG Animation
 1. pathLength: 현재 우리 위치까지의 path 의 길이를 나타냄
 2. transition={{
      default: { duration: 5},
      fill: {delay:5, duration:2 }
    }}
  #7.10
  1.CSS - position
   - position: absolute; "부모 엘리먼트 내부에 속박되지 않음(독립적), 그러나 부모element가 position:relative; 상위 element기준으로 offset "
   - positton: relative; "원래 기준에서 offset "
    */
/*#8.1 Header part One - Router,
1. npx create-react-app@5.0.0 react-masterclass-tsx2 --template typescript
2. npx i styled-components >> 문제 체크 >> @types/ 설치
3. npx i react-router-dom@5.3.0 >> 문제체크 >> @types/ 설치 
  import {BrowserRouter, Switch, Route} from "react-router-dom";
  <BrowserRouter>
      <Switch>
        <Route path="/">
          <Coins />
        </Route>
      </Switch>
    </BrowserRouter>
4. 우리가 우리 Router에게 우리의 URL이 변수값을 갖는다는 걸 말해주는 방식 
5. 그리고 [index.tsx]에서 <React.StrictMode> </React.StrictMode> 빼줘야함 
6. const tvMatch = useRouteMatch("/tv")는 항상 "/" 부분에서 true를 반환한다(경로를 가지고 있다라고 해석 )   
  >> 만약, 라우터의 순서가 "/" 다음 "/tv" 이면 "/" === true를 먼저 반환 따라서, Home화면을 보여줌 
  >> ★이해: "/tv" "/" 둘다 true를 반환, 라우터 가장 압 부분을 먼저 반환, Tv화면을 보여줌 
  
7. 링크 & Prop 
  1) <Link to="/about" > </Link > 
  2) <Link to="/courses?sort=name" /> 쿼리argument
  3) <Link 
      to={{
        pathname: "/courses",
        search: "?sort=name",
        hash:"#the-hash",
        state: { fromDashboard: true } "object를 통해서 데이터 그 자체를 보낼 수 있음" & "비하인드더씬 데이터를 보냄"
      }}
    />
  7. CSS 
  - position: fixed; "화면을 위아래로 스크롤 하더라도 브라우저 화면의 특정 부분에 고정되어 움직이는 UI"
   
*/


function App() {

  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Header /> 
      <Switch>
        <Route path="/tv">
          <Tv />
        </Route>
        <Route path={["/search"]}>
          <Search />
        </Route>
        <Route path={["/", "/movies/:movieId"]}>
          <Home />
        </Route>
      </Switch>
        
    </BrowserRouter>
  )
};

export default App; 
