//Imports
import { useState, useEffect } from "react";
import { Formik } from "formik";
import isEmpty from "lodash.isempty";
import { useMediaQuery } from "react-responsive";
//import i18next from "../../imports/i18n/i18n";
import { searchInitialValues, searchValidationschema } from "./FormType";
//Components
import Navbar from "../../components/navbar/Navbar";
import SideMenu from "../../components/sideMenu/SideMenu";
import { RadioGroup, Radio } from "@chakra-ui/react";
//Style
import "./nftForm.scss";

const NftForm = (props: any) => {
  const { match, history } = props;
  //const t = i18next.t.bind(i18next);

  const isMobile = useMediaQuery({
    query: "(max-width: 768px)",
  });
  const [network, setNetwork] = useState(match.params.network);

  useEffect(() => {
    setNetwork(match.params.network);
  }, [match]);

  useEffect(() => {
    setNetwork(match.params.network);
  }, [match]);

  return (
    <div
      id="form-wrapper"
      // style={{
      //   backgroundImage: `url("${"https://firebasestorage.googleapis.com/v0/b/xrplnft.appspot.com/o/background.jpg?alt=media&token=298ccbd3-482c-4052-90c2-aaeeaf371b6c"}"`,
      // }}
    >
      <Navbar />
      <SideMenu sideMenuVisible={!isMobile} />
      <div className="form-container">
        <h1>Visualize a NFT</h1>
        <p>
          Visualize all NFTs minted according to the Aesthetes' standards.
          <br />
          <br />
          Join the XRPL NFTs revolution
        </p>
        <Formik
          initialValues={searchInitialValues}
          validationSchema={searchValidationschema}
          onSubmit={(values) => {
            history.push(`/${network}/nft-data/${values.issuer}/${values.id}`);
          }}
        >
          {({ handleChange, handleSubmit, errors, values, setFieldValue }) => {
            return (
              <div className="form">
                <div className="form-input">
                  <input
                    className={`input ${
                      errors.issuer && values.issuer !== "" ? "error" : ""
                    }`}
                    placeholder="Address of the NFT Issuer"
                    value={values.issuer}
                    onChange={(e) => setFieldValue("issuer", e.target.value)}
                  />
                  <input
                    className={`input ${
                      errors.id && values.id !== "" ? "error" : ""
                    }`}
                    placeholder="Identifier of the NFT (currency name)"
                    value={values.id}
                    onChange={(e) => setFieldValue("id", e.target.value)}
                  />
                </div>
                <RadioGroup
                  defaultValue="testnet"
                  className="radio-btn-container"
                >
                  <div className="radio-container">
                    <Radio
                      value="testnet"
                      checked={network === "testnet"}
                      onChange={() => history.push("/testnet")}
                    >
                      Testnet
                    </Radio>
                  </div>
                  <div className="radio-container">
                    <Radio
                      value="mainnet"
                      checked={network === "mainnet"}
                      onChange={() => history.push("/mainnet")}
                    >
                      Mainnet
                    </Radio>
                  </div>
                </RadioGroup>
                <div className="btn-container">
                  <button
                    disabled={
                      // disabled if both inputs are empty or if there are errors
                      Object.values(values).some((v) => v === "") ||
                      !isEmpty(errors)
                    }
                    id="action-btn"
                    onClick={() => handleSubmit()}
                  >
                    {/* {t("nftForm.visualize")} */}
                    Visualize
                  </button>
                </div>
              </div>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default NftForm;
