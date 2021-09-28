import "./nftData.scss";
import artwork from "../../images/mainOpera.jpg";
import Navbar from "../../components/navbar/Navbar";
import RightArrow from "../../images/rightArrow";
import LeftArrow from "../../images/leftArrow";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.css";

SwiperCore.use([Navigation, Pagination]);

const NftData = () => {
  return (
    <div id="single-nft-container">
      <Navbar />
      <Swiper
        pagination={{ clickable: true }}
        spaceBetween={50}
        slidesPerView={1}
        onSwiper={(e) => {
          console.log("onSwiper");
        }}
        onSlideChange={(e) => {
          console.log("onSlideChange");
        }}
        navigation={{
          nextEl: ".arrow-container",
          prevEl: ".left-arrow-container",
        }}
      >
        <SwiperSlide>
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
              <div className="arrow-container">
                <RightArrow />
              </div>
            </div>
          </div>
        </SwiperSlide>

        <SwiperSlide>
          <div id="wrapper">
            <div className="artwork-container-small">
              <img id="artwork-small" alt="opera" src={artwork} />
              <div className="third-row">
                <div className="go-back">
                  <div className="left-arrow-container">
                    <p className="go-back-text">BACK to Visualizer</p>
                    <LeftArrow />
                  </div>
                </div>
              </div>
            </div>
            <div className="data-container">
              <div className="nft-title-info">
                <p>NFT Info</p>
              </div>
              <div className="first-row">
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
                      Lorem ipsum Author: Lorem Ipsum Description: Lorem ipsum
                      dolor sit amet, consectetur adipisci elit, sed eiusmod
                      tempor incidunt ut labore et dolore magna aliqua. Ut enim
                      ad minim veniam, quis nostrum exercitationem ullam
                      corporis suscipit laboriosam, nisi ut aliquid ex ea
                      commodi consequatur.
                    </p>
                  </div>
                </div>
              </div>
              <div className="second-row">
                <div className="links-container">
                  <div className="links-row">
                    <div className="link-label">
                      <p>Digital artwork</p>
                    </div>
                    <div className="links-btn-container">
                      <button className="link-btn">PRIMARY LINK</button>
                      <button className="link-btn">BACKUP LINK</button>
                    </div>
                  </div>
                  <div className="links-row">
                    <div className="link-label">
                      <p>Metadata viewer</p>
                    </div>
                    <div className="links-btn-container">
                      <button className="link-btn">NFT METADATA</button>
                    </div>
                  </div>
                  <div className="links-row">
                    <div className="link-label">
                      <p>On-chain information</p>
                    </div>
                    <div className="links-btn-container">
                      <button className="link-btn">ISSUING DATA</button>
                      <button className="link-btn">OWNER ACCOUNT</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default NftData;
