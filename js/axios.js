const submit = document.querySelector("#submit")
const searchedWord = document.querySelector("#searched-word")
const pronounce = document.querySelector("#pronounce")
const errorMsg = document.querySelector(".error-msg")
const content = document.querySelector("#content")
const sourceLink = document.querySelector("#source-link")
const footer = document.querySelector("footer")
let word = ""
let data

submit.addEventListener("click", (e) => {
	e.preventDefault()
	word = document.querySelector("#input").value
	
	const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
	
	axios.get(url).then(function (response) {
		data = response.data[0]
		errorMsg.classList.add("remove-display")
		content.classList.remove("remove-display")
		footer.classList.remove("remove-display")

		innerData()

	}).catch(function (error) {
		errorMsg.classList.remove("remove-display")
		content.classList.add("remove-display")
		footer.classList.add("remove-display")
		console.log(content)
		console.error(error);
	});

})

window.addEventListener("load", () => {
	word = "keyboard"
	const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
	
	axios.get(url).then(function (response) {
		data = response.data[0]
		innerData()
	}).catch(function (error) {
		console.error(error);
	});
})
 
function innerData(){
	//inner the data inside the html elements
	const str = data.word.charAt(0).toUpperCase() + data.word.slice(1); //capitalize the first letter of the searched word
	searchedWord.innerHTML = `${str}`
	pronounce.innerHTML = `${data.phonetic}`
	
	//get the audio
	pronounceAudio = undefined // clear the audio before inner a new one
	getAudio()	

	//inner the meanings ul
	const meaningSection = document.querySelector("#meaning-section")
	const meaning = data.meanings
	const meaningHtml = meaning.map((meaning) => {
		const definitions = meaning.definitions
		const synonyms = meaning.synonyms
		const definitionsArr = definitions.map(definition => {return `<li>${definition.definition}</li>`})
		const examples = definitions.map(definition => {
			if(typeof definition.example == "string"){
				return (
					`<span>" ${definition.example} "</span>`
					
					)
			} else {
				return ""
			}
		})
		const example = examples.join(" ")
		// console.log(examples)
		// console.log(definitionsArr[0] + examples[0])
		let definition = ""
		for (let i = 0; i < definitionsArr.length; i++) {
			definition += definitionsArr[i]+examples[i];
		}
		const singleDefinition = definition //transform the array in a string to evade the comma after each return
		const synonymsArr = synonyms.map(synonym => {return `<span>${synonym}</span>`})
		const singleSynonym = synonymsArr.join(",  ")
		if(singleSynonym.length == 0){
			return (
				`<h2 class="word-type">${meaning.partOfSpeech}</h2>
				<div class="meaning-wrapper">
				  <p>Meaning</p>
				  <ul>
				  ${singleDefinition}
				  </ul>
				  </div>`
			)
		} else {
			return (
				`<h2 class="word-type">${meaning.partOfSpeech}</h2>
				<div class="meaning-wrapper">
				  <p>Meaning</p>
				  <ul>
				  ${singleDefinition}
				  </ul>
				  </div>
				<div class="synonums"˝>
				  <p>Synonyms: ${singleSynonym}</p>
				</div>`
			)
		}
	})
	const meaningsString = meaningHtml.join("")
	meaningSection.innerHTML = meaningsString
	sourceLink.innerHTML = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
	sourceLink.href = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
}


// scope to get the audio and play˝
var pronounceAudio
function getAudio(){
	let phonetics = data.phonetics
	let audioSrc
	phonetics.forEach(phonetic => {
		if(phonetic.audio.length > 0){
			audioSrc = phonetic.audio
		}
	});
	pronounceAudio = new Audio(audioSrc)
	
	//select play button html and add listener to play the audio
	const playBtn = document.querySelector("#play-audio")
	playBtn.addEventListener("click", () => {
		pronounceAudio.play()
	})
}