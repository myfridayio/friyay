
const json = process.argv.slice(2).join(' ')
const stuff = JSON.parse(json)

const { data: { getHistoryById: { KanyeSpotify, JeenYuhs, FollowsKanye } } } = stuff

process.exit(KanyeSpotify && JeenYuhs && FollowsKanye ? 0 : 1)
