/* eslint-disable react/react-in-jsx-scope */
import React from 'react';
import styled from 'styled-components/macro';
import useAbsoluteContent from '../../hooks/useAbsoluteContent';

const GameEditionMobileConatiner = styled.div`
  width: 95%;
  @media only screen and (min-width: ${({ theme: { mediaQueries } }) => `${mediaQueries.mobilePixel}px`}) and (max-width: ${({
      theme: { mediaQueries },
    }) => `${mediaQueries.desktopPixel - 1}px`}) {
    width: 80%;
  }
`;

const GameEditionMobileWrapper = ({ startLabel, startOnClick, selectLabel, selectOnClick, children }) => {
  useAbsoluteContent('svgContent', 'Rectangle_38');
  return (
    <GameEditionMobileConatiner>
      <div id="svgContent" style={{ position: 'absolute' }}>
        {children}
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 675 1098" style={{ width: '100%' }}>
        <defs>
          <linearGradient id="linear-gradient" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0" stopColor="#22fefe" />
            <stop offset="0.552" stopColor="#6f6ede" />
            <stop offset="1" stopColor="#4a186f" />
          </linearGradient>
          <linearGradient id="linear-gradient-4" x2="1" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0" stopColor="#5c4499" />
            <stop offset="1" stopColor="#271259" />
          </linearGradient>
          <linearGradient id="linear-gradient-5" x1="0.5" y1="-0.032" x2="0.5" y2="1" gradientUnits="objectBoundingBox">
            <stop offset="0" stopColor="#fefb66" />
            <stop offset="1" stopColor="#ff36d0" />
          </linearGradient>
          <clipPath id="clipPath">
            <rect width="128.435" height="33.189" fill="none" />
          </clipPath>
          <linearGradient id="linear-gradient-7" x1="30.661" y1="35.41" x2="30.645" y2="35.433" gradientUnits="objectBoundingBox">
            <stop offset="0" stopColor="#f2248d" />
            <stop offset="1" stopColor="#791247" />
          </linearGradient>
          <linearGradient id="linear-gradient-9" x1="29.04" y1="36.018" x2="29.023" y2="36.041" xlinkHref="#linear-gradient-7" />
          <linearGradient id="linear-gradient-12" x1="78.443" y1="66.987" x2="78.412" y2="67.03" xlinkHref="#linear-gradient-7" />
          <filter id="Ellipse_18">
            <feOffset dx="2" dy="5" input="SourceAlpha" />
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feFlood floodColor="#00f041" floodOpacity="0.161" result="color" />
            <feComposite operator="out" in="SourceGraphic" in2="blur" />
            <feComposite operator="in" in="color" />
            <feComposite operator="in" in2="SourceGraphic" />
          </filter>
          <linearGradient id="linear-gradient-13" x1="-0.125" y1="-0.859" x2="0.772" y2="1.336" gradientUnits="objectBoundingBox">
            <stop offset="0" stopColor="#fff" />
            <stop offset="1" stopColor="#6cc34a" />
          </linearGradient>
        </defs>
        <g id="game-edition" transform="translate(-421.152 -8)">
          <g id="Group_1" data-name="Group 1" transform="translate(421.152 8)">
            <path
              id="Rectangle_5782"
              data-name="Rectangle 5782"
              d="M20,0H655a20,20,0,0,1,20,20V1038a60,60,0,0,1-60,60H20a20,20,0,0,1-20-20V20A20,20,0,0,1,20,0Z"
              transform="translate(0)"
              fill="url(#linear-gradient)"
            />
            <path
              id="Rectangle_5781"
              data-name="Rectangle 5781"
              d="M20,0H655a20,20,0,0,1,20,20V1038a60,60,0,0,1-60,60H20a20,20,0,0,1-20-20V20A20,20,0,0,1,20,0Z"
              transform="translate(0)"
              fill="url(#linear-gradient)"
              style={{ mixBlendMode: 'multiply', isolation: 'isolate' }}
            />
            <path
              id="Rectangle_36"
              data-name="Rectangle 36"
              d="M20,0H650a20,20,0,0,1,20,20V1030a60,60,0,0,1-60,60H20a20,20,0,0,1-20-20V20A20,20,0,0,1,20,0Z"
              transform="translate(0 0)"
              fill="url(#linear-gradient)"
            />
            <path
              id="Rectangle_37"
              data-name="Rectangle 37"
              d="M10,0H612a10,10,0,0,1,10,10V780a50,50,0,0,1-50,50H10A10,10,0,0,1,0,820V10A10,10,0,0,1,10,0Z"
              transform="translate(24 24)"
              fill="url(#linear-gradient-4)"
            />
            <g
              id="Rectangle_38"
              data-name="Rectangle 38"
              transform="translate(56 56)"
              stroke="#d11f7a"
              strokeWidth="2"
              fill="url(#linear-gradient-5)"
            >
              <rect width="558" height="766" stroke="none" />
              <rect x="1" y="1" width="556" height="764" fill="none" />
            </g>
            <g id="Repeat_Grid_2" data-name="Repeat Grid 2" transform="translate(520.839 1054.507) rotate(-20)" clipPath="url(#clipPath)">
              <g transform="translate(-1021 -803)">
                <rect id="Rectangle_9" data-name="Rectangle 9" width="6" height="18" rx="3" transform="translate(1021 803)" fill="#30184a" />
              </g>
              <g transform="translate(-1004 -803)">
                <rect id="Rectangle_9-2" data-name="Rectangle 9" width="6" height="18" rx="3" transform="translate(1021 803)" fill="#30184a" />
              </g>
              <g transform="translate(-987 -803)">
                <rect id="Rectangle_9-3" data-name="Rectangle 9" width="6" height="18" rx="3" transform="translate(1021 803)" fill="#30184a" />
              </g>
              <g transform="translate(-970 -803)">
                <rect id="Rectangle_9-4" data-name="Rectangle 9" width="6" height="18" rx="3" transform="translate(1021 803)" fill="#30184a" />
              </g>
              <g transform="translate(-953 -803)">
                <rect id="Rectangle_9-5" data-name="Rectangle 9" width="6" height="18" rx="3" transform="translate(1021 803)" fill="#30184a" />
              </g>
              <g transform="translate(-936 -803)">
                <rect id="Rectangle_9-6" data-name="Rectangle 9" width="6" height="18" rx="3" transform="translate(1021 803)" fill="#30184a" />
              </g>
              <g transform="translate(-919 -803)">
                <rect id="Rectangle_9-7" data-name="Rectangle 9" width="6" height="18" rx="3" transform="translate(1021 803)" fill="#30184a" />
              </g>
              <g transform="translate(-902 -803)">
                <rect id="Rectangle_9-8" data-name="Rectangle 9" width="6" height="18" rx="3" transform="translate(1021 803)" fill="#30184a" />
              </g>
            </g>
            <g id="select_button" data-name="Group 56904" transform="translate(335.068 932.76)" style={{ cursor: 'pointer' }} onClick={selectOnClick}>
              <g id="Group_56903" data-name="Group 56903" transform="translate(0 0)">
                <rect
                  id="Rectangle_43"
                  data-name="Rectangle 43"
                  width="81.704"
                  height="19.162"
                  rx="6"
                  transform="matrix(0.899, -0.438, 0.438, 0.899, 0, 35.817)"
                  fill="#feb43f"
                />
                <text
                  id="MENU"
                  transform="matrix(0.899, -0.438, 0.438, 0.899, 24.918, 61.977)"
                  fill="#e3e3e3"
                  fontSize="14"
                  fontFamily="press-start-regular"
                  fontWeight="500"
                  letterSpacing="0.01em"
                >
                  <tspan x="0" y="0">
                    {selectLabel}
                  </tspan>
                </text>
              </g>
              <path
                id="Path_12"
                data-name="Path 12"
                d="M81.536.978a8.39,8.39,0,0,1-2.128,5.187C77.33,8.293,74.99,9.492,73.222,9.492l-66.94.183C2.8,9.675,0,3.487,0,0Z"
                transform="matrix(0.899, -0.438, 0.438, 0.899, 4.245, 44.396)"
                fill="#c9c9c9"
                opacity="0.198"
              />
            </g>
            <g id="start_button" data-name="Group 56905" transform="translate(219.295 931.068)" style={{ cursor: 'pointer' }} onClick={startOnClick}>
              <g id="Group_56902" data-name="Group 56902" transform="translate(0 0)">
                <rect
                  id="Rectangle_42"
                  data-name="Rectangle 42"
                  width="81.704"
                  height="19.162"
                  rx="6"
                  transform="matrix(0.899, -0.438, 0.438, 0.899, 0, 35.817)"
                  fill="#feb43f"
                />
                <text
                  id="SWAP"
                  transform="matrix(0.899, -0.438, 0.438, 0.899, 18.613, 65.534)"
                  fill="#e3e3e3"
                  fontSize="14"
                  fontFamily="press-start-regular"
                  fontWeight="500"
                  letterSpacing="0.01em"
                >
                  <tspan x="0" y="0">
                    {startLabel}
                  </tspan>
                </text>
              </g>
              <path
                id="Path_13"
                data-name="Path 13"
                d="M81.536.978a8.39,8.39,0,0,1-2.128,5.187C77.33,8.293,74.99,9.492,73.222,9.492l-66.94.183C2.8,9.675,0,3.487,0,0Z"
                transform="matrix(0.899, -0.438, 0.438, 0.899, 4.294, 44.611)"
                fill="#c9c9c9"
                opacity="0.198"
              />
            </g>
            <g id="A_-_B_Button" data-name="A - B Button" transform="translate(468 886)">
              <g id="b" transform="translate(0 35.856)">
                <ellipse
                  id="Ellipse_21"
                  data-name="Ellipse 21"
                  cx="38.828"
                  cy="38.572"
                  rx="38.828"
                  ry="38.572"
                  transform="translate(0 0)"
                  fill="url(#linear-gradient-4)"
                />
                <ellipse
                  id="Ellipse_21-2"
                  data-name="Ellipse 21"
                  cx="34.453"
                  cy="34.226"
                  rx="34.453"
                  ry="34.226"
                  transform="translate(4.376 4.346)"
                  fill="#fe43c0"
                />
                <g id="Ellipse_23" data-name="Ellipse 23" transform="translate(11.154 7.162)">
                  <ellipse id="Ellipse_899" data-name="Ellipse 899" cx="29.389" cy="29.196" rx="29.389" ry="29.196" fill="url(#linear-gradient-7)" />
                  <ellipse
                    id="Ellipse_900"
                    data-name="Ellipse 900"
                    cx="28.957"
                    cy="28.766"
                    rx="28.957"
                    ry="28.766"
                    transform="translate(0.432 0.429)"
                    fill="none"
                    stroke="#f2248d"
                    strokeWidth="1"
                  />
                </g>
                <text
                  id="B-2"
                  data-name="B"
                  transform="translate(24.936 43.952)"
                  fill="#e3e3e3"
                  fontSize="20"
                  fontFamily="Helvetica Neue"
                  fontWeight="500"
                  style={{ mixBlendMode: 'multiply', isolation: 'isolate' }}
                >
                  <tspan x="0" y="0">
                    B
                  </tspan>
                </text>
              </g>
              <g id="a" transform="translate(96.25 0)">
                <ellipse
                  id="Ellipse_22"
                  data-name="Ellipse 22"
                  cx="39.375"
                  cy="39.116"
                  rx="39.375"
                  ry="39.116"
                  transform="translate(0 0)"
                  fill="url(#linear-gradient-4)"
                />
                <ellipse
                  id="Ellipse_22-2"
                  data-name="Ellipse 22"
                  cx="34.453"
                  cy="34.769"
                  rx="34.453"
                  ry="34.769"
                  transform="translate(4.376 4.346)"
                  fill="#fe43c0"
                />
                <g id="Ellipse_24" data-name="Ellipse 24" transform="translate(10.208 7.534)">
                  <ellipse id="Ellipse_901" data-name="Ellipse 901" cx="29.389" cy="29.196" rx="29.389" ry="29.196" fill="url(#linear-gradient-9)" />
                  <ellipse
                    id="Ellipse_902"
                    data-name="Ellipse 902"
                    cx="28.957"
                    cy="28.766"
                    rx="28.957"
                    ry="28.766"
                    transform="translate(0.432 0.429)"
                    fill="none"
                    stroke="#f2248d"
                    strokeWidth="1"
                  />
                </g>
                <path
                  id="Path_11"
                  data-name="Path 11"
                  d="M-1993.614-1577.889s10.742-1.7,18.574,1.921,12.76,12.575,12.76,12.575"
                  transform="translate(2026.734 1589.98)"
                  fill="none"
                  stroke="#fdfdfd"
                  strokeWidth="1"
                  opacity="0.198"
                  style={{ mixBlendMode: 'normal', isolation: 'isolate' }}
                />
                <text
                  id="A-2"
                  data-name="A"
                  transform="translate(26.702 40.14)"
                  fill="#e3e3e3"
                  fontSize="22"
                  fontFamily="Helvetica Neue"
                  fontWeight="500"
                  style={{ mixBlendMode: 'multiply', isolation: 'isolate' }}
                >
                  <tspan x="0" y="0">
                    A
                  </tspan>
                </text>
              </g>
            </g>
            <g id="Group_56907" data-name="Group 56907" transform="translate(26 886)">
              <g id="arrow" transform="translate(0 0)">
                <rect
                  id="Rectangle_39"
                  data-name="Rectangle 39"
                  width="53.321"
                  height="148"
                  rx="6"
                  transform="translate(47.339)"
                  fill="url(#linear-gradient-4)"
                />
                <rect
                  id="Rectangle_40"
                  data-name="Rectangle 40"
                  width="148"
                  height="54.573"
                  rx="6"
                  transform="translate(0 47.315)"
                  fill="url(#linear-gradient-4)"
                />
              </g>
              <g id="arrow-2" data-name="arrow" transform="translate(4.863 4.863)">
                <rect
                  id="Rectangle_39-2"
                  data-name="Rectangle 39"
                  width="43.598"
                  height="138.27"
                  rx="6"
                  transform="translate(47.335 0)"
                  fill="#fe43c0"
                />
                <rect
                  id="Rectangle_40-2"
                  data-name="Rectangle 40"
                  width="138.27"
                  height="44.845"
                  rx="6"
                  transform="translate(0 47.315)"
                  fill="#fe43c0"
                />
                <g id="Ellipse_20" data-name="Ellipse 20" transform="translate(48.582 48.56)">
                  <ellipse id="Ellipse_895" data-name="Ellipse 895" cx="20.553" cy="20.553" rx="20.553" ry="20.553" fill="#f2248d" />
                  <circle
                    id="Ellipse_896"
                    data-name="Ellipse 896"
                    cx="20.073"
                    cy="20.073"
                    r="20.073"
                    transform="translate(0.48 0.48)"
                    fill="none"
                    stroke="#f2248d"
                    strokeWidth="1"
                  />
                </g>
                <g id="Ellipse_25" data-name="Ellipse 25" transform="translate(52.319 51.048)">
                  <circle id="Ellipse_897" data-name="Ellipse 897" cx="17.439" cy="17.439" r="17.439" fill="url(#linear-gradient-12)" />
                  <circle
                    id="Ellipse_898"
                    data-name="Ellipse 898"
                    cx="16.959"
                    cy="16.959"
                    r="16.959"
                    transform="translate(0.48 0.48)"
                    fill="none"
                    stroke="#f2248d"
                    strokeWidth="1"
                  />
                </g>
                <g id="Rectangle_44" data-name="Rectangle 44" transform="translate(52.319 4.877)">
                  <rect id="Rectangle_5323" data-name="Rectangle 5323" width="34.879" height="2.492" rx="1" fill="#f2248d" />
                  <rect
                    id="Rectangle_5324"
                    data-name="Rectangle 5324"
                    width="33.918"
                    height="1.532"
                    rx="0.5"
                    transform="translate(0.48 0.48)"
                    fill="none"
                    stroke="#f2248d"
                    strokeWidth="1"
                  />
                </g>
                <g id="Rectangle_45" data-name="Rectangle 45" transform="translate(95.917 51.024)">
                  <rect id="Rectangle_5325" data-name="Rectangle 5325" width="34.879" height="3.737" rx="1" fill="#f2248d" />
                  <rect
                    id="Rectangle_5326"
                    data-name="Rectangle 5326"
                    width="33.918"
                    height="2.777"
                    rx="0.5"
                    transform="translate(0.48 0.48)"
                    fill="none"
                    stroke="#f2248d"
                    strokeWidth="1"
                  />
                </g>
                <g id="Rectangle_46" data-name="Rectangle 46" transform="translate(6.229 51.024)">
                  <rect id="Rectangle_5327" data-name="Rectangle 5327" width="36.125" height="3.737" rx="1" fill="#f2248d" />
                  <rect
                    id="Rectangle_5328"
                    data-name="Rectangle 5328"
                    width="35.165"
                    height="2.777"
                    rx="0.5"
                    transform="translate(0.48 0.48)"
                    fill="none"
                    stroke="#f2248d"
                    strokeWidth="1"
                  />
                </g>
              </g>
            </g>
            <g id="Power">
              <g data-type="innerShadowGroup">
                <circle id="Ellipse_18-2" data-name="Ellipse 18" cx="8" cy="8" r="8" transform="translate(32 215)" fill="#74c04b" />
                <g transform="matrix(1, 0, 0, 1, 0, 0)" filter="url(#Ellipse_18)">
                  <circle id="Ellipse_18-3" data-name="Ellipse 18" cx="8" cy="8" r="8" transform="translate(32 215)" fill="#fff" />
                </g>
              </g>
              <circle id="Ellipse_911" data-name="Ellipse 911" cx="6" cy="6" r="6" transform="translate(34 217)" fill="url(#linear-gradient-13)" />
            </g>
          </g>
          <path
            id="Path_14"
            data-name="Path 14"
            d="M-121.91,164.66,165.833,34.584V77.376c0,48.206-30.93,87.284-69.083,87.284Z"
            transform="translate(930.319 940.514)"
            fill="#563392"
            opacity="0.203"
            style={{ mixBlendMode: 'normal', isolation: 'isolate' }}
          />
        </g>
      </svg>
    </GameEditionMobileConatiner>
  );
};

export default GameEditionMobileWrapper;
