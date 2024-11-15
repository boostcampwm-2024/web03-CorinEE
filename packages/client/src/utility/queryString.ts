export function convertToQueryString(marketList:string[]){
	return marketList.map(market=>`market=${market}`).join('&')
}