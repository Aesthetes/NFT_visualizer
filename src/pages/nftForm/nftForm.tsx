//Imports
import { useState, useEffect } from "react";
import { Formik } from "formik";
import isEmpty from "lodash.isempty";

//Components
import Navbar from "../../components/navbar/Navbar";
import SideMenu from "../../components/sideMenu/SideMenu";

import "./nftForm.scss";
import i18next from "../../imports/i18n/i18n";
import { searchInitialValues, searchValidationschema } from "./FormType";

const NftForm = (props: any) => {
  const { match, history } = props;
  const t = i18next.t.bind(i18next);

  const [network, setNetwork] = useState("testnet");

  useEffect(() => {
    console.log("MATCH ==>", match);
    setNetwork(match.params.network);
  }, [match]);

  return (
    <div id="form-wrapper">
      <Navbar />
      <SideMenu sideMenuVisible />
      <div className="form-container">
        <h1>Visualize a NFT</h1>
        <p>
          Visualize all NFTs minted according to the Aesthetes's standards.
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
            //console.log("values :", values);
            //console.log("errors :", errors);
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
                <div className="radio-btn-container">
                  <div className="radio-container">
                    <input
                      type="radio"
                      name="testnet"
                      checked={network === "testnet"}
                      onChange={() => history.push("/testnet")}
                    />
                    <p>Testnet</p>
                  </div>
                  <div className="radio-container">
                    <input
                      type="radio"
                      name="mainnet"
                      checked={network === "mainnet"}
                      onChange={() => history.push("/mainnet")}
                    />
                    <p>Mainnet</p>
                  </div>
                </div>
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
                    {t("nftForm.visualize")}
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
