import { useState, useEffect } from "react";
import Navbar from "../../components/navbar/Navbar";
import Drawer from "@material-ui/core/Drawer";
import RightArrow from "../../images/rightArrow";
import LeftArrow from "../../images/leftArrow";
import { FaChevronUp } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation, Pagination } from "swiper";
import "swiper/swiper-bundle.css";
import { useMediaQuery } from "react-responsive";
import "./nftData.scss";
import { useQuery } from "react-query";
import Lottie from "react-lottie-player";
import loaderAnimationData from "../../lotties/loader.json";
import { getNFTMetadata, getNFTImage } from "../../imports/scripts/NFT_handler";
import { useHistory } from "react-router-dom";
import GreenCheck from "../../images/greenCheck";
SwiperCore.use([Navigation, Pagination]);

type NftData = {
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
};

const NftDataPage = (props: any) => {
  const { match } = props;
  const history = useHistory();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [issuer, setIssuer] = useState(match.params.issuer);
  const [id, setId] = useState(match.params.id);
  const [activeQuery, setActiveQuery] = useState(false);
  const [artwork, setArtwork] = useState<any>("");
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

  useEffect(() => {
    console.log("QUI", nftData);
  }, [nftData]);

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });

  const { isFetching: loading, error } = useQuery(
    "featchNFTData",
    async () => {
      setActiveQuery(false);
      let data = await getNFTMetadata(issuer, id, match.params.network);

      setNftData(data);
      setArtwork(await getNFTImage(data.content_cid));
    },
    {
      enabled: activeQuery,
    }
  );

  const currentNetwork = match.params.network;
  useEffect(() => {
    if (error) {
      console.log("ERRORE");
      history.push(`/${currentNetwork}/error`);
    }
    if (issuer && id) {
      setActiveQuery(true);
    }
  }, [id, issuer, history, error, currentNetwork]);

  console.log("NFTDATA ==>", artwork);

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
      <div id="single-nft-container">
        <Navbar />
        <Swiper
          pagination={{ clickable: true }}
          spaceBetween={50}
          slidesPerView={1}
          navigation={{
            nextEl: ".arrow-container",
            prevEl: ".left-arrow-container",
          }}
        >
          {/* DESKTOP */}
          {!isMobile && (
            <>
              <SwiperSlide>
                <div id="artwork-container">
                  <img id="artwork" alt="opera" src={artwork} />
                  <div className="artwork-details">
                    <div className="name-container">
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
                      className="left-arrow-container"
                      onClick={() => history.goBack()}
                    >
                      <p className="go-back-text">BACK</p>
                      <LeftArrow />
                    </div>
                    <div className="arrow-container">
                      <p className="go-to-details">NFT Info</p>
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
                          <p
                            className="go-back-text"
                            style={{ fontSize: "14px" }}
                          >
                            BACK to Visualizer
                          </p>
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
                          <p>{nftData?.name}</p>
                        </div>
                        <div className="author-container">
                          <p className="artwork-details-label">Author:</p>
                          <p>{nftData?.author}</p>
                        </div>
                        <div className="description-container">
                          <p className="nft-description">Description:</p>
                          <p>{nftData?.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="second-row">
                      <div className="links-container">
                        <div className="links-row">
                          {nftData?.detected_minter_obj.certified && (
                            <div className="links-with-check">
                              <GreenCheck />
                            </div>
                          )}
                          <div className="links-btn-container">
                            <button className="link-btn">
                              DIGITAL ARTWORK
                            </button>
                            <button className="link-btn">NFT METADATA</button>
                          </div>
                        </div>
                        <div className="onchain-info-container">
                          <div className="link-label">
                            <p>On-chain information</p>
                          </div>
                          <div className="links-row">
                            <div className="links-btn-container">
                              <button className="link-btn">ISSUING DATA</button>
                              <button className="link-btn">
                                OWNER ACCOUNT
                              </button>
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
            <div
              className="mobile-container"
              style={{ backgroundImage: `url(${artwork})` }}
            >
              <div className="mobile-artwork-details">
                <div className="name-container">
                  <p className="mobile-artwork-details-label">Name:</p>
                  <p>{nftData?.name}</p>
                </div>
                <div className="author-container">
                  <p className="mobile-artwork-details-label">Author:</p>
                  <p>{nftData?.author}</p>
                </div>
              </div>
              <div className="mobile-artwork-container">
                <div className="check">
                  <GreenCheck />
                </div>
                <img id="mobile-artwork" alt="opera" src={artwork} />
              </div>
              <div className="bottom-drawer">
                <div
                  className="chevron-container"
                  onClick={() => setIsDrawerOpen(true)}
                >
                  <FaChevronUp size="40" />
                </div>
                NFT Info
              </div>
              <Drawer
                BackdropProps={{ style: { opacity: 0 } }}
                anchor="bottom"
                open={isDrawerOpen}
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
                    <button className="link-btn">DIGITAL ARTWORK</button>
                    <button className="link-btn">NFT METADATA</button>
                  </div>

                  <div className="links-row-2">
                    <div className="link-label">
                      <p>On-chain information</p>
                    </div>
                    <div className="links-row-2-inner">
                      <button className="link-btn">ISSUING DATA</button>
                      <button className="link-btn">OWNER ACCOUNT</button>
                    </div>
                  </div>
                </div>
              </Drawer>
            </div>
          )}
        </Swiper>
      </div>
    </>
  );
};

export default NftDataPage;
