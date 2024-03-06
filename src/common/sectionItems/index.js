import styled from "styled-components";

export default styled.div`
  display:grid;
  grid-template-columns: repeat(auto-fill, minmax(500px, 1fr));
  gap: 10px;
  /* margin: 30px; */

  @media (max-width:550px){
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;