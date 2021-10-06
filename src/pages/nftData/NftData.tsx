//Imports
import { useState, useEffect, useRef } from "react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { useMediaQuery } from "react-responsive";
import { useQuery } from "react-query";
import Lottie from "react-lottie-player";
import loaderAnimationData from "../../lotties/loader.json";
import { getNFTMetadata, getNFTImage } from "../../imports/scripts/NFT_handler";
import { useHistory } from "react-router-dom";

//Components
import Navbar from "../../components/navbar/Navbar";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import ReactPlayer from "react-player";

//Images and icons
import { FaChevronUp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import BackArrow from "../../images/backArrow";
import GreenCheck from "../../images/greenCheck";
import OnlyArrowBack from "../../images/onlyArrowBack";
import OnlyArrowForward from "../../images/onlyArrowForward";

//Style
import "./nftData.scss";
import nftBackground from "../../images/nft-background.jpg";

SwiperCore.use([Navigation, Pagination]);

/* type NftData = {
  identifier: string;
  actual_nft_owner: string;
  detected_hot_wallet_obj: string;
  detected_minter_obj: string;
  metadata_cid: string;
  detected_cti: string;
  metadata_tx_hash: string;
  name: string;
  description: string;
  author: string;
  content_cid: string;
}; */

const NftDataPage = (props: any) => {
  const { match } = props;
  const history = useHistory();

  const videoRef = useRef();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [issuer] = useState(match.params.issuer);
  const [id] = useState(match.params.id);
  const [activeQuery, setActiveQuery] = useState(false);
  const [error, setError] = useState(false);
  const [play, setPlay] = useState(true);
  const [artwork, setArtwork] = useState<any>("");
  const [contentType, setContentType] = useState<any>("");
  const [nftData, setNftData] = useState<any>({
    identifier: "",
    actual_nft_owner: "",
    detected_hot_wallet_obj: "",
    detected_minter_obj: "",
    metadata_cid: "",
    detected_cti: "",
    metadata_tx_hash: "",
    name: "",
    description: "",
    author: "",
    content_cid: "",
  });

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const { isFetching: loading } = useQuery(
    "featchNFTData",
    async () => {
      try {
        setActiveQuery(false);
        let data = await getNFTMetadata(issuer, id, match.params.network);

        setNftData(data);

        let { url, type } = await getNFTImage(data.content_cid);

        setArtwork(url);
        setContentType(type);
      } catch (e) {
        console.log(e);
        setError(true);
      }
    },
    {
      enabled: activeQuery,
    }
  );

  const currentNetwork = match.params.network;
  const currentNetworkForUrl =
    currentNetwork === "testnet" ? currentNetwork.substring(0, 4) : "";

  useEffect(() => {
    if (error) {
      history.push(`/${currentNetwork}/error`);
    }
    if (issuer && id) {
      setActiveQuery(true);
    }
  }, [id, issuer, history, error, currentNetwork]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {loading && (
        <div className="loader-container">
          <Lottie
            loop
            animationData={loaderAnimationData}
            play
            style={{
              width: "200px",
              height: "200px",
            }}
          />
        </div>
      )}
      <div id={`single-nft-container`} style={isMobile ? {} : { width: "90%" }}>
        <Navbar />
        <Swiper
          centeredSlides
          centeredSlidesBounds
          pagination={{ clickable: true }}
          spaceBetween={0}
          slidesPerView={1}
          navigation={{
            nextEl: ".back-arrow-container-desktop",
            prevEl: ".back-arrow-container-desktop-prev",
          }}
        >
          {/* DESKTOP */}
          {!isMobile && (
            <>
              <SwiperSlide
                style={{
                  width: "100%",
                  height: "100vh",
                }}
              >
                <div id="artwork-container">
                  {contentType?.includes("image") && (
                    <img id="artwork" alt="opera" src={artwork} />
                  )}
                  {contentType?.includes("video") && (
                    <div style={{ position: "relative" }}>
                      <ReactPlayer
                        controls
                        playing={play}
                        loop={true}
                        playsinline={true}
                        url={artwork}
                        width="100%"
                        height="100%"
                      />
                    </div>
                  )}
                  <div className="artwork-details">
                    <div
                      className="name-container"
                      style={{ paddingBottom: "1rem" }}
                    >
                      <p className="artwork-details-label">Name:</p>
                      <p>{nftData?.name}</p>
                    </div>
                    <div className="author-container">
                      <p className="artwork-details-label">Author:</p>
                      <p>{nftData?.author}</p>
                    </div>
                  </div>
                  <div className="navigation-arrows">
                    <div
                      className="back-arrow-container-desktop"
                      onClick={() => history.push("/")}
                    >
                      <p className="go-back-text">Back</p>
                      <OnlyArrowBack />
                    </div>
                    <div className="back-arrow-container-desktop">
                      <p className="go-to-details">NFT Info</p>
                      <OnlyArrowForward />
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide>
                <div id="wrapper">
                  <div className="artwork-container-small">
                    {contentType?.includes("image") && (
                      <img id="artwork-small" alt="opera" src={artwork} />
                    )}
                    {contentType?.includes("video") && (
                      <div id={"artwork-small"}>
                        <ReactPlayer
                          controls
                          playing={play}
                          loop={true}
                          playsinline={true}
                          url={artwork}
                          width="100%"
                          height="100%"
                        />
                      </div>
                    )}
                    <div className="third-row">
                      <div className="go-back">
                        <div className="back-arrow-container-desktop-prev">
                          <p
                            className="go-back-text"
                            style={{ fontSize: "16px" }}
                          >
                            BACK to Visualizer
                          </p>
                          <OnlyArrowBack />
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
                        <div className="nft-info-container">
                          <div className="author-name">
                            <div className="name-container">
                              <p className="artwork-details-label">Name:</p>
                              <p>{nftData?.name}</p>
                            </div>
                            <div className="author-container">
                              <p className="artwork-details-label">Author:</p>
                              <p>{nftData?.author}</p>
                            </div>
                          </div>
                          {nftData?.detected_minter_obj.certified && (
                            <div className="links-with-check">
                              <GreenCheck />
                            </div>
                          )}
                        </div>
                        <div className="description-container">
                          <p className="nft-description">Description:</p>
                          <p className="nft-description-text">
                            {nftData?.description}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="second-row">
                      <div className="links-container">
                        <div className="links-row">
                          <div className="links-btn-container">
                            <a
                              className="link-btn"
                              href={`https://gateway.pinata.cloud/ipfs/${nftData.content_cid}`}
                              target={"_blank"}
                              rel="noreferrer"
                            >
                              DIGITAL ARTWORK
                            </a>
                            <a
                              className="link-btn"
                              href={`https://gateway.pinata.cloud/ipfs/${nftData.metadata_cid}`}
                              target={"_blank"}
                              rel="noreferrer"
                            >
                              NFT METADATA
                            </a>
                          </div>
                        </div>
                        <div className="onchain-info-container">
                          <div className="link-label">
                            <p>On-chain information</p>
                          </div>
                          <div className="links-row">
                            <div className="links-btn-container">
                              <a
                                className="link-btn"
                                href={`https://${currentNetworkForUrl}.bithomp.com/explorer/${nftData.metadata_tx_hash}`}
                                target={"_blank"}
                                rel="noreferrer"
                              >
                                ISSUING DATA
                              </a>
                              <a
                                className="link-btn"
                                href={`https://${currentNetworkForUrl}.bithomp.com/explorer/${nftData.actual_nft_owner}`}
                                target={"_blank"}
                                rel="noreferrer"
                              >
                                OWNER ACCOUNT
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </>
          )}

          {/* MOBILE */}
          {isMobile && (
            <div className="mobile-container">
              <div
                className="mobile-container"
                style={{
                  backgroundImage: `url(${
                    contentType?.includes("image") ? artwork : nftBackground
                  })`,
                  zIndex: 0,
                  opacity: 0.8,
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />

              <div className="mobile-artwork-details">
                <div className="nft-info-container">
                  <div className="author-name" style={{ paddingLeft: "1rem" }}>
                    <div className="name-container">
                      <p className="mobile-artwork-details-label">Name:</p>
                      <p>{nftData?.name}</p>
                    </div>
                    <div className="author-container">
                      <p className="mobile-artwork-details-label">Author:</p>
                      <p>{nftData?.author}</p>
                    </div>
                  </div>
                  <div className="check">
                    <GreenCheck />
                  </div>
                </div>
              </div>
              <div className="mobile-artwork-container">
                {contentType.includes("image") && (
                  <img id="mobile-artwork" alt="opera" src={artwork} />
                )}
                {contentType?.includes("video") && (
                  <div style={{ position: "relative" }}>
                    <video
                      controls
                      src={artwork}
                      width="100%"
                      autoPlay={play}
                      loop={true}
                      playsInline={true}
                    />
                  </div>
                )}
              </div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  className="back-arrow-container"
                  onClick={() => history.push("/")}
                >
                  <BackArrow />
                </div>
              </div>
              <div className="bottom-drawer">
                <div className="chevron-container">
                  <FaChevronUp
                    size="40"
                    onClick={() => setIsDrawerOpen(true)}
                  />
                </div>
                NFT Info
              </div>
              <SwipeableDrawer
                BackdropProps={{ style: { opacity: 0 } }}
                anchor="bottom"
                open={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                onOpen={() => setIsDrawerOpen(true)}
                swipeAreaWidth={60}
                disableSwipeToOpen={false}
              >
                <div id="drawer-container">
                  <div
                    className="close-btn"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <IoMdClose size="32" />
                  </div>
                  <div className="mobile-nft-info">
                    <div className="description-container">
                      <div className="drawer-headings">
                        <h3>NFT Info</h3>
                        <p className="nft-description">Description:</p>
                      </div>
                      <p className="description">{nftData?.description}</p>
                    </div>
                  </div>
                  <div className="links-row-1">
                    <a
                      className="link-btn"
                      href={`https://gateway.pinata.cloud/ipfs/${nftData.content_cid}`}
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      DIGITAL ARTWORK
                    </a>
                    <a
                      className="link-btn"
                      href={`https://gateway.pinata.cloud/ipfs/${nftData.metadata_cid}`}
                      target={"_blank"}
                      rel="noreferrer"
                    >
                      NFT METADATA
                    </a>
                  </div>

                  <div className="links-row-2">
                    <div className="link-label">
                      <p>On-chain information</p>
                    </div>
                    <div className="links-row-2-inner">
                      <a
                        className="link-btn"
                        href={`https://${currentNetworkForUrl}.bithomp.com/explorer/${nftData.metadata_tx_hash}`}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        ISSUING DATA
                      </a>
                      <a
                        className="link-btn"
                        href={`https://${currentNetworkForUrl}.bithomp.com/explorer/${nftData.actual_nft_owner}`}
                        target={"_blank"}
                        rel="noreferrer"
                      >
                        OWNER ACCOUNT
                      </a>
                    </div>
                  </div>
                </div>
              </SwipeableDrawer>
            </div>
          )}
        </Swiper>
      </div>
    </>
  );
};

export default NftDataPage;
