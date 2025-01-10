import { sm2 } from 'sm-crypto'

const publicKey = '049c44d38d8bbe1671827c4569cbb17ad6978ab72048fec91279f764266662ccbf47f4b3fb0b94057b61d7cf0605bb27cc5e8eb89b2d0247a5b72671c103cd9561'

/**
 * sm2加密
 * @param data 待加密数据
 * @return 加密后的数据
 */
export const sm2Encrypt = (data: string): string => {
	return '04' + sm2.doEncrypt(data, publicKey, 1)
}
