const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogArray) => {
    let totallikes = 0
    blogArray.forEach(element => {
        totallikes += element.likes
    });
    return totallikes
}

const favoriteBlog = (blogArray) => {
    let maxlike = 0
    let fave = null
        blogArray.forEach(item => {
        if(item.likes > maxlike){
                maxlike = item.likes
                fave = item
        }
        })
        return fave
}

const findbiggy = (arr) => {
	let bigindex = 0
	arrlength = 0
	for(let i = 0; i < arr.length; i++){
		if(arr[i].length > arrlength){
			arrlength = arr[i].length
		}
	}
	return arrlength
}

const mostblogs = (blogArray) => {
	arr1 = []
	let tracker = []
	blogArray.forEach(item => {
	const arrcopy  = blogArray.filter(element => !(tracker.includes(element.author)) && element.author === item.author)
	tracker.push(item.author)
	arr1.push(arrcopy)
	})
	let biggy = findbiggy(arr1)
	return({author: arr1[biggy][0].author, blogs: biggy})
}

const findlikes = (arr) => {
	let bigindex = 0
	let arrlikesobj = []
	for(let i = 0; i < arr.length; i++){
		if(arr[i].length !== 0){
			let likeobj = {author: arr[i][0].author, likes: 0}
			arr[i].forEach(item => likeobj['likes'] += item.likes)
			arrlikesobj.push(likeobj)
		}
	}
	let maxlikes = 0
	let index = 0
	for(let i = 0; i < arrlikesobj.length; i++){
		if(arrlikesobj[i].likes > maxlikes){
			maxlikes = arrlikesobj[i].likes
			index = i
		}
	}
	return arrlikesobj[index]
}

const mostlikes = (blogArray) => {
	arr1 = []
	let tracker = []
	blogArray.forEach(item => {
	const arrcopy  = blogArray.filter(element => !(tracker.includes(element.author)) && element.author === item.author)
	tracker.push(item.author)
	arr1.push(arrcopy)
	})
	let biggy = findlikes(arr1)
	return(biggy)
}


  
module.exports = {
    dummy,
    totalLikes, 
    favoriteBlog,
    mostblogs,
    mostlikes
}