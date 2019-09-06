function errHandler(a) {
    if (a == 1) {
        throw new Error('test err');
    }
}

try {
    errHandler(1);
} catch(e) {
    console.log('catch e');
}
