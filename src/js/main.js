require.config(
    {
        baseUrl:"src/js"
    }
)

require(["app"],function(App){
    App.init()
});