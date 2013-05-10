function replaceAll(str, de, para) {
	while (str.indexOf(de) != -1) {
		str = str.replace(de, para);
	}
	return str;
}