import { useState } from "react";
import "./nftData.scss";
import artwork from "../../images/mainOpera.jpg";
import Navbar from "../../components/navbar/Navbar";
import RightArrow from "../../images/rightArrow";
import LeftArrow from "../../images/leftArrow";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";

const NftData = () => {
  const [goToDetails, setGoToDetails] = useState(false);
  return (
    <Swiper
      spaceBetween={0}
      slidesPerView={1}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <div
        style={{
          position: "relative",
          height: "100vh",
        }}
      >
        <div id="single-nft-container">
          <Navbar />
          {/*  <SwiperSlide>
            <div id="artwork-container">
              <img id="artwork" alt="opera" src={artwork} />
              <div className="artwork-details">
                <div className="name-container">
                  <p className="artwork-details-label">Name:</p>
                  <p>Lorem ipsum</p>
                </div>
                <div className="author-container">
                  <p className="artwork-details-label">Author:</p>
                  <p>Lorem ipsum</p>
                </div>
              </div>
              <div className="go-to-details">
                <p>NFT Info</p>
                <div
                  className="arrow-container"
                  onClick={() => setGoToDetails(!goToDetails)}
                >
                  <RightArrow />
                </div>
              </div>
            </div>
          </SwiperSlide>
 */}
          <SwiperSlide>
            <div id="artwork-container-small">
              <img id="artwork-small" alt="opera" src={artwork} />
            </div>
            <div className="first-row">
              <div className="nft-title-info">
                <p color="white">NFT Info</p>
              </div>
              <div className="nft-info">
                <div className="name-container">
                  <p className="artwork-details-label">Name:</p>
                  <p>Lorem ipsum</p>
                </div>
                <div className="author-container">
                  <p className="artwork-details-label">Author:</p>
                  <p>Lorem ipsum</p>
                </div>
                <div className="description-container">
                  <p className="nft-description">Description:</p>
                  <p>
                    Name: Lorem ipsum Author: Lorem Ipsum Description: Lorem
                    ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
                    tempor incidunt ut labore et dolore magna aliqua. Ut enim ad
                    minim veniam, quis nostrum exercitationem ullam corporis
                    suscipit laboriosam, nisi ut aliquid ex ea commodi
                    consequatur.
                  </p>
                </div>
              </div>
            </div>
            <div className="second-row">
              <div className="go-back">
                <p className="go-back-text">BACK to Visualizer</p>
                <div className="left-arrow-container">
                  <LeftArrow />
                </div>
              </div>
              <div className="links-container">
                <div className="links-row">
                  <div className="link-label">
                    <p>Digital artwork</p>
                  </div>
                  <div className="links-btn-container">
                    <button>PRIMARY LINK</button>
                    <button>BACKUP LINK</button>
                  </div>
                </div>
                <div className="links-row">
                  <div className="link-label">
                    <p>Metadata viewer</p>
                  </div>
                  <div className="links-btn-container">
                    <button>NFT METADATA</button>
                  </div>
                </div>
                <div className="links-row">
                  <div className="link-label">
                    <p>On-chain information</p>
                  </div>
                  <div className="links-btn-container">
                    <button>ISSUING DATA</button>
                    <button>OWNER ACCOUNT</button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </div>
      </div>
    </Swiper>
  );
};

export default NftData;
