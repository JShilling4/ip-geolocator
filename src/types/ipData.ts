export interface IpDataType {
  ip: string;
  isp: string;
  name: string;
  location: {
    city: string;
    country: string;
    lat: number;
    lng: number;
    postalCode: string;
    region: string;
    timezone: string;
  };
}
