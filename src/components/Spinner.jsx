import React from 'react'
import { BeatLoader } from "react-spinners";
import styled from 'styled-components';

const SpinnerWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
`;
const Spinner = () => {
    return (
        <SpinnerWrapper>
            <BeatLoader color="#123abc" margin={5} size={15} />
        </SpinnerWrapper>
    );
}
export default Spinner;
