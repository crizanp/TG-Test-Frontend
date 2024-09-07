import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import styled from "styled-components";
import { debounce } from "lodash";
import { FaTelegramPlane, FaCopy, FaArrowRight, FaCrown } from "react-icons/fa";
import UserInfo from "./UserInfo"; // Ensure the path is correct

// Color Palette
const mainBackground = "#1f1f1f"; // Dark background for the app
const dimmedBackground = "rgba(255, 255, 255, 0.1)"; // Dimmed background for cards/sections
const boxShadowColor = "rgba(0, 0, 0, 0.5)"; // Shadow for containers
const telegramBlue = "#0088cc"; // Main Telegram blue
const telegramLightBlue = "#36A8E5"; // Light blue for highlights
const white = "#ffffff"; // White for main text/icons

// Main container
const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: ${mainBackground};
  padding: 30px 20px;
  color: ${white};
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

// User Info Section
const UserInfoContainer = styled.div`
  margin-top: 20px;
  text-align: center;
`;

// Points Display section
const PointsDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 60px;
`;

const InviteIcon3D = styled.img`
  width: 80px;
  height: 80px;
  margin-bottom: 15px;
  filter: drop-shadow(0px 0px 8px ${telegramLightBlue});
`;

const InviteText = styled.p`
  font-size: 20px;
  text-align: center;
  color: ${white};
  margin-bottom: 40px;
`;

// Referral section
const ReferralContainer = styled.div`
  background: ${dimmedBackground};
  padding: 25px;
  max-width: 600px;
  margin-top: 30px;
`;

const BonusBox = styled.div`
  background: ${dimmedBackground};
  padding: 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const BonusContent = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const BonusIcon = styled.img`
  width: 50px;
  height: 50px;
`;

const BonusText = styled.div`
  font-size: 18px;
  color: ${white};
  display: flex;
  flex-direction: column;
`;

const CrownText = styled.span`
  font-size: 14px;
  color: #f3e9e9;
  margin-top: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const BonusArrow = styled.div`
  font-size: 20px;
  color: ${white};
`;

// Referral Button and Copy Button aligned in the same row
const ButtonRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
`;

const ReferralButton = styled.button`
  background-color: ${telegramBlue}; /* Main blue color */
  color: white;
  padding: 12px 50px;
  border-radius: 8px;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  border: none; /* Ensure no border */
  outline: none; /* Remove default button outline */

  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Light shadow with proper color */

  &:hover {
    background-color: ${telegramLightBlue};
  }
`;

const CopyIcon = styled(FaCopy)`
  cursor: pointer;
  color: rgba(255, 255, 255, 0.8); /* Slightly dimmed white */
  font-size: 32px;
  transition: color 0.3s;

  &:hover {
    color: ${white}; /* Full white on hover */
  }
`;

// Copy Success Message
const CopySuccessMessage = styled.p`
  color: ${telegramLightBlue};
  font-size: 16px;
  text-align: center;
  margin-top: 15px;
`;

// Referral Stats Section (Updated to match the previous div style)
const ReferralStatsContainer = styled(ReferralContainer)`
  margin-top: 40px;
`;

const ReferralStatsHeading = styled.h3`
  font-size: 20px;
  color: ${white};
  margin-bottom: 10px;
`;

const NoReferralsMessage = styled.p`
  font-size: 16px;
  color: ${white};
  text-align: center;
  margin-top: 20px;
`;

const ReferralItem = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.1);
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const ReferralUsername = styled.div`
  font-size: 15px;
  font-weight: bold;
  color: ${white};
`;

const ReferralPoints = styled.div`
  font-size: 15px;
  color: ${white};
`;

const PointText = styled.span`
  margin-top: 0;
  font-size: 14px;
`;

export const CrownIcon = styled(FaCrown)`
  color: #f3e9e9;
  font-size: 1.5rem;
`;

// FriendPage Component
const FriendPage = () => {
  const [userID, setUserID] = useState(null);
  const [points, setPoints] = useState(0);
  const [referralLink, setReferralLink] = useState("");
  const [copySuccess, setCopySuccess] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    const getUserID = async () => {
      const tgUserID = window.Telegram.WebApp?.initDataUnsafe?.user?.id;
      if (tgUserID) {
        setUserID(tgUserID);
      } else {
        console.error("User ID not available from Telegram.");
      }
    };

    getUserID();
  }, []);

  const fetchUserInfo = useCallback(
    debounce(async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/user-info/${userID}`
        );
        const userData = response.data;
        setPoints(userData.points);
        setReferralLink(`https://t.me/cizantest_bot?start=${userID}`);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }, 1000),
    [userID]
  );

  const fetchReferralStats = useCallback(
    debounce(async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/referrals/stats/${userID}`
        );
        setReferralCount(response.data.referralCount);
        setReferrals(response.data.referrals);
      } catch (error) {
        console.error("Error fetching referral stats:", error);
      }
    }, 1000),
    [userID]
  );

  useEffect(() => {
    if (userID) {
      fetchUserInfo();
      fetchReferralStats();
    }
  }, [userID, fetchUserInfo, fetchReferralStats]);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(referralLink)
      .then(() => {
        setCopySuccess("Referral link copied!");
        setTimeout(() => setCopySuccess(""), 3000);
      })
      .catch(() => {
        setCopySuccess("Failed to copy.");
        setTimeout(() => setCopySuccess(""), 3000);
      });
  };

  const handleForwardLink = () => {
    const inviteLink = `https://t.me/share/url?url=${encodeURIComponent(
      referralLink
    )}&text=Join%20and%20earn%20rewards!`;
    window.Telegram.WebApp?.openTelegramLink(inviteLink);
  };

  return (
    <MainContainer>
      {/* User Info Section */}
      <UserInfoContainer>
        <UserInfo userID={userID} points={points} />
      </UserInfoContainer>

      {/* Invite Friend Section */}
      <PointsDisplayContainer>
        <InviteIcon3D
          src="https://cdn-icons-png.flaticon.com/512/272/272482.png"
          alt="Invite Icon"
        />
        <InviteText>
          You and your friend will receive bonuses for the invitation!
        </InviteText>
      </PointsDisplayContainer>

      {/* Referral Container */}
      <ReferralContainer>
        <BonusBox>
          <BonusContent>
            <BonusIcon
              src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
              alt="Premium Icon"
            />
            <BonusText>
              Invite Premium User
              <CrownText>
                <CrownIcon /> <PointText>3000</PointText>
              </CrownText>
            </BonusText>
          </BonusContent>
          <BonusArrow>
            <FaArrowRight />
          </BonusArrow>
        </BonusBox>

        <BonusBox>
          <BonusContent>
            <BonusIcon
              src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
              alt="Crown Icon"
            />
            <BonusText>
              Invite a Friend
              <CrownText>
                <CrownIcon /> 2000
              </CrownText>
            </BonusText>
          </BonusContent>
          <BonusArrow>
            <FaArrowRight />
          </BonusArrow>
        </BonusBox>

        {/* Buttons for Telegram and Copy Link */}
        <ButtonRow>
          <ReferralButton onClick={handleForwardLink}>
            <FaTelegramPlane />
            Invite via Telegram
          </ReferralButton>
          <CopyIcon onClick={handleCopyLink} />
        </ButtonRow>
        {copySuccess && <CopySuccessMessage>{copySuccess}</CopySuccessMessage>}
      </ReferralContainer>

      {/* Referral Stats Section */}
      <ReferralStatsContainer>
        <ReferralStatsHeading>Referral Stats</ReferralStatsHeading>
        <p>Total Referrals: {referralCount}</p>

        {referralCount === 0 ? (
          <NoReferralsMessage>You have no referrals yet</NoReferralsMessage>
        ) : (
          <ReferralContainer>
            <div>
              {referrals.map((referral) => (
                <ReferralItem key={referral.id}>
                  <ReferralUsername>{referral.username}</ReferralUsername>
                  <ReferralPoints><CrownText>
                <CrownIcon /> <PointText>{referral.points}</PointText>
              </CrownText></ReferralPoints>
                </ReferralItem>
              ))}
            </div>
          </ReferralContainer>
        )}
      </ReferralStatsContainer>
    </MainContainer>
  );
};

export default FriendPage;
