export const authConfig = {
    pages:{
        signIn : "/login"
    },
    providers : [],
    callbacks:{
        async jwt({token , user}){
            if(user){
                token.id = user.id;
                token.isAdmin = user.isAdmin;
            }

            return token;
        },

        async session({token , session}){
            if(token){
                session.user.id = token.id;
                session.user.isAdmin= token.isAdmin;
            }

            return session;
        },

        authorized({auth , request}){
            const user = auth?.user;
            const isOnAdminPanel = request.nextUrl?.pathname.startsWith("/admin");
            const isOnBlogPage = request.nextUrl?.pathname.startsWith("/blog");
            const isOnLoginPage = request.nextUrl?.pathname.startsWith("/login");
            const isCreateBlogPage = request.nextUrl?.pathname.startsWith("/createBlog");

            // ONLY ADMIN CAN REACH THE ADMIN DASHBOARD
            if (isOnAdminPanel && !user?.isAdmin) {
                return false;
            }

            // ONLY AUTHENTICATED USERS CAN REACH THE BLOG PAGE
            if (isOnBlogPage && !user) {
                return false;
            }

             // ONLY AUTHENTICATED USERS CAN REACH THE CREATE BLOG PAGE
             if (isCreateBlogPage && !user) {
                return false;
            }

            // ONLY UNAUTHENTICATED USERS CAN REACH THE LOGIN PAGE
            if (isOnLoginPage && user) {
                return Response.redirect(new URL("/", request.nextUrl));
            }

            return true
        }
    }
}