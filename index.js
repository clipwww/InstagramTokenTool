const clientId = "f1c8b84c85ea439db955254bbf990929";
const redirect_url = `${location.origin}${location.pathname.replace("index.html", "")}auth.html`;
const authUrl = `https://www.instagram.com/oauth/authorize/?client_id=${clientId}&redirect_uri=${redirect_url}&response_type=token`;


let app = new Vue({
    el: "#app",
    data: {
        datas: [],
        userId: "",
        token: "",
        name: "",
        picture: ""
    },
    methods: {
        GetTokenAndId(){
            let $self = this;
            //window.open(authUrl);
            let popup = window.open('auth.html', 'auth', 'toolbar=no,height=200,width=200,scrollbars=no,status=no');
            popup.onload = function () {
                //open authorize url in pop-up
                if (window.location.hash.length == 0) {
                    popup.location.href = authUrl;
                }

                //an interval runs to get the access token from the pop-up
                let interval = setInterval(() => {
                    try {
                        console.log(window.location);
                        //check if hash exists
                        if (popup.location.hash.length) {
                            //hash found, that includes the access token
                            clearInterval(interval);
                            let accessToken = popup.location.hash.slice(14); //slice #access_token= from string
                            popup.close();
                            $self.token = accessToken;

                            $.ajax({
                                url: `https://api.instagram.com/v1/users/self/?access_token=${$self.token}`,
                                type: "GET",
                                data: {},
                                dataType: "jsonp",
                                success(res){
                                    console.log(res);
                                    $self.userId = res.data.id;
                                    $self.name = res.data.full_name;
                                    $self.picture = res.data.profile_picture;
                                    $self.GetPictures();
                                }
                            });
                        }
                    }
                    catch (evt) {
                        //permission denied
                        console.log(evt);
                        console.log("error");
                        popup.close();
                        clearInterval(interval);
                    }
                }, 100);
            }
        },
        GetPictures() {
            let $self = this;
            $.ajax({
                url: `https://api.instagram.com/v1/users/${$self.userId}/media/recent/?access_token=${$self.token}`,
                type: "GET",
                data: {},
                dataType: "jsonp",
                success(res) {
                    console.log(res);
                    $self.datas = res.data;
                }
            });
        }
    },
    created() {

    }
})
