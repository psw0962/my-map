import { useMap } from "react-kakao-maps-sdk";
import Button from "@/component/button";

const SearchAddressBounds = ({ searchAddress, setSearchAddress }) => {
  // input이 onChange될 때 마다 위도 경도를 불러와서 setState를 해줘야함....
  console.log(searchAddress);

  // 맵
  const map = useMap();
  // 주소로 검색 함수
  const geocoder = new kakao.maps.services.Geocoder();
  // 키워드로 검색 함수
  const ps = new kakao.maps.services.Places();
  // 바운스 함수
  const bounds = new kakao.maps.LatLngBounds();

  const onClickSearchAddress = () => {
    // 키워드로 검색 함수
    const placesSearchCB = (data, status) => {
      console.log("키워드로", status);
      if (status === kakao.maps.services.Status.OK) {
        new kakao.maps.LatLngBounds();
        setSearchAddress((prev) => {
          return {
            ...prev,
            lat: data[0].y,
            lng: data[0].x,
          };
        });
      }
    };

    // 주소로 검색 함수
    geocoder.addressSearch(searchAddress.keyWord, function (result, status) {
      console.log("주소로", status);
      if (status === kakao.maps.services.Status.OK) {
        setSearchAddress((prev) => {
          return {
            ...prev,
            lat: result[0].y,
            lng: result[0].x,
          };
        });
      } else {
        ps.keywordSearch(searchAddress.keyWord, placesSearchCB);
      }
    });

    const boundsData = bounds.extend(
      new kakao.maps.LatLng(searchAddress.lat, searchAddress.lng)
    );

    map.setBounds(boundsData);
  };

  return (
    <>
      <Button
        fontSize="2rem"
        backgroundColor="#5599FF"
        border="1px solid #5599FF"
        color="#fff"
        padding="0.5rem"
        onClick={() => onClickSearchAddress()}
      >
        주소검색
      </Button>
    </>
  );
};

export default SearchAddressBounds;
