export function convertToQueryString(marketList:string[]){
	if(marketList.length === 0) return ''
	return marketList.map(market=>`market=${market}`).join('&')
}