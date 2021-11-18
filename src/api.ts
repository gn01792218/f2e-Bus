//引入你配置的axios
import req from './http'
import  {City} from '@/types/enum';

const sceneProperty ="$select=ID%2CCity%2CName%2CDescriptionDetail%2CPhone%2CAddress%2CTravelInfo%2COpenTime%2CWebsiteUrl%2CTicketInfo%2CRemarks%2CParkingPosition%2CPicture%2CPosition&"
const foodProperty = "$select=ID%2CName%2CDescription%2CPhone%2COpenTime%2CWebsiteUrl%2CAddress%2CPicture%2CPosition%2CCity%2CClass&"
const hotelProperty = "$select=ID%2CName%2CDescription%2CGrade%2CAddress%2CPhone%2CWebsiteUrl%2CPicture%2CPosition%2CServiceInfo%2CSpec%2CClass%2CGrade&"
const activityProperty = "$select=ID%2CName%2CDescription%2CParticpation%2CLocation%2CAddress%2CPhone%2COrganizer%2CStartTime%2CEndTime%2CWebsiteUrl%2CPicture%2CPosition%2CClass1%2CClass2%2CCharge%2CRemarks&"


//公車動態API
//取得指定[縣市]的公車動態定時資料(A1)[逐筆更新]
export const getReallTimeBusByCity = (City:string) => {
    return req('get',`/v2/Bus/RealTimeByFrequency/City/${City}?$format=JSON`)
}
//取得指定[縣市],[路線名稱]的公車動態定時資料(A1)[逐筆更新]
export const getReallTimeBusByCityAndRoute = (City:string,RouteName:number) => {
    return req('get',`/v2/Bus/RealTimeByFrequency/City/${City}/${RouteName}$format=JSON`)
}
//取得指定[縣市]的公車動態定點資料(A2)[逐筆更新]
export const getReallTimeNearStopByCity = (City:string) => {
    return req('get',`/v2/Bus/RealTimeNearStop/City/${City}?$format=JSON`)
}
//取得指定[縣市],[路線名稱]的公車動態定點資料(A2)[逐筆更新]
export const getReallTimeNearStopByCityAndRoute = (City:string,RouteName:number) => {
    return req('get',`/v2/Bus/RealTimeNearStop/City/${City}/${RouteName}$format=JSON`)
}
//預估到站API
//取得指定縣市的公車預估到站資料
export const getEstimatedTimeOfArrivalByCity = (City:string) => {
    return req('get',`/v2/Bus/EstimatedTimeOfArrival/City/${City}?$format=JSON`)
}
//取得指定[縣市],[路線名稱]的公車預估到站資料(N1)[逐筆更新]
export const getEstimatedTimeOfArrivalByCityAndRouteName = (City:string,RouteName:number) => {
    return req('get',`/v2/Bus/EstimatedTimeOfArrival/City/${City}/${RouteName}$format=JSON`)
}

//取得縣市公車路線資料
export const getRouteByCity = (City:string) => {
    return req('get',`v2/Bus/Route/City/${City}?$format=JSON`)
}
export const getRouteByCityAndRouteName = (City:string,RouteName:number) => {
    return req('get',`/v2/Bus/Route/City/${City}/${RouteName}?$format=JSON`)
}