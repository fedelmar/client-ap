

const MyApp = ({Component, pageProps}) => {
    
    console.log('Desde _app.js')

    return (
        <Component {...pageProps} />
    );
}

export default MyApp;