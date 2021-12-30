const CONTRACT_ADDRESS = '0xE36ea9ad78762115b73A2381B94ea60104b0cE21';

const transformCharacterData = (characterData) => {
	return {
		name: characterData.name,
		imageURI: characterData.imageURI,
		hp: characterData.hp.toNumber(),
		maxHp: characterData.maxHp.toNumber(),
		attackDamage: characterData.attackDamage.toNumber(),
	};
};

export { CONTRACT_ADDRESS, transformCharacterData };