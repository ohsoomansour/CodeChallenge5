import styled from "styled-components";
import {motion, useAnimation, useViewportScroll, useScroll} from "framer-motion";
import {Link, useRouteMatch, useHistory } from "react-router-dom" 
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

/* 
1. position: relative; "요소를 일반적인 문서 흐름에 따라 배치하고, 자기 자신을 기준으로 offset"
2. const homeMatch = useRouteMatch("/");
    console.log(match); //{path: '/', url: '/', isExact: true, params: {…}}  
    ▼Object
      isExact: true
    ▶params: {}
      path: "/"
      url:"/"
 3.https://fontawesome.com/v5.15/icons/airbnb?style=brands

 4. 🥇Code Challenge🥇
  🔹On the / (home) page implement sliders for: Latest movies, Top Rated Movies and Upcoming Movies.
  🔹On the /tv page implement sliders for: Latest Shows, Airing Today, Popular, Top Rated.
  🔹On the /search page implement sliders for movie results and tv results.
  🔹Make the /movie/:id prettier.
  🔹Implement /tv/:id as well.
*/
interface IForm {
  keyword: string;
}

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed; 
  width: 100%;
  top:0;
  height: 70px;
  font-size: 14px;
  padding: 20px 60px;
  color: white;
`;
const Col = styled.div`
  display: flex;
  align-items: center;
`;
const Items = styled.ul`
  display: flex;
  align-items:center;
`;
const Item = styled.li`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: 20px;
  color:${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;
const Circle = styled(motion.span)`
  position: absolute;
  width:5px;
  height:5px;
  border-radius:5px;
  bottom: -5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.red};
`;
const Logo = styled(motion.svg)`
  width: 95px;
  height: 25px;
  margin-right: 20px;
  fill: ${(props) => props.theme.red};
  path{
    stroke: white;
    stroke-width: 6px;
  }
`;
const Search = styled.form`
  color: white;
  display: flex;
  align-items: center;
  position:relative;
  svg {
    height: 25px;
  }
`;
const Input = styled(motion.input)`
  transform-origin: right;
  position: absolute;
  right: 30px;
  padding: 5px 10px;
  padding-left: 40px;
  z-index: -1; 
  color:white;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;
const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    },
  },
};
const navVariants = {
  top:{
    backgroundColor: "rgba(0, 0, 0, 1)"
  },
  scroll:{
    backgroundColor: "rgba(0, 0, 0, 0)"
  },
}
export default function Header() {
  
  const homeMatch = useRouteMatch("/");
  const tvMatch = useRouteMatch("/tv");
  const [searchOpen, setSearchOpen] = useState(false);
  const inputAnimation = useAnimation(); // https://www.framer.com/docs/animation/ > Overview 젤 밑 페이지
  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
         scaleX:0,
      })
      // trigger the close animation
    } else {
      inputAnimation.start({
         scaleX: 1,})
      // trigger the open animation 
    }
    setSearchOpen((prev) => !prev);
  }
  const navAnimation = useAnimation();
  const {scrollY, scrollYProgress} = useViewportScroll();
  
  useEffect(() => {
    scrollY.onChange(() => {
      if(scrollY.get() > 80 ){
        navAnimation.start("scroll")
        
      } else {
        navAnimation.start("top")
      }
      //console.log(scrollY.get())
    })
    
  }, [scrollY, navAnimation])
  //console.log(homeMatch, tvMatch);
  const {register, handleSubmit} = useForm<IForm>();
  const history = useHistory();
  const Valid = (data:IForm) => {
    //console.log(data);
    history.push(`/search?keyword=${data.keyword}`);
  };
  return (
  <Nav
   variants={navVariants}
   initial="top"
   animate={navAnimation}
  >
    <Col>
      <Logo
        variants={logoVariants}
        whileHover="active"
        initial="normal"
        width= "1024"
        height="276.742"
        viewBox="0 0 1024 276.742" 
      >
        <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
      </Logo>
        <Items>
          <Item>
            <Link to="/"> Home{homeMatch?.isExact && <Circle layoutId="circle" />} </Link>
          </Item>
          <Item>
            <Link to="/tv"> Tv{tvMatch?.isExact && <Circle layoutId="circle" /> } </Link>
          </Item>
        </Items>
    </Col>

    <Col>
      <Search onSubmit={handleSubmit(Valid)}> 
        <motion.svg
          onClick={toggleSearch}
          animate={{ x: searchOpen ? -240 : 0 }}
          transition={{ type: "linear" }}
          fill="white"
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 512 512"
          >
          <motion.path 
            d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"
          />
        </motion.svg>
        <Input
          {...register("keyword", { required: true, minLength: 2 })}
          animate={inputAnimation}
          initial={{ scaleX: 0}}
          transition={{ type: "linear" }}
          
          placeholder="Search for moive or tv show..."
        />
      </Search>
    </Col>
  </Nav>
    )
};