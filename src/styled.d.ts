import 'styled-components';

// and extend them!  
// styled-components의 테마정의를 확장 
declare module 'styled-components' {
  export interface DefaultTheme {
    red: string;
    black: {
      veryDark: string;
      darker: string;
      lighter: string;
    };
    white: {
      darker: string;
      lighter: string;
    };
  }
  }
