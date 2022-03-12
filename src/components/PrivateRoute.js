import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Spinner from "./Spinner";
import TokenService from "../services/TokenService";

const PrivateRoute = (props) => {
  const [isValidUser, setIsValidUser] = useState(false);

  const [searchParams] = useSearchParams();
  const RoomId = searchParams.get("room"),
    username = searchParams.get("username"),
    token = searchParams.get("token");

  useEffect(() => {
    let isMouted = false;

    if (!isMouted) {
      TokenService.verify({ token, RoomId, username })
        .then(result => {
          if (result) setIsValidUser(true)
        })
        .catch(e => { setIsValidUser(false) });
    }

    return () => {
      isMouted = true;
    };
  }, []);

  return isValidUser
    ? props.children
    : <Spinner />
    // : <Navigate to="/" />
};

export default PrivateRoute;