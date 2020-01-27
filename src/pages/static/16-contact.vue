<template>
  <main class="pri-pad contact-block">
    <section class="top pri-pad-b">
      <div class="container">
        <div class="row">
          <div class="col-md-12 col-sm-12 text-center lh-normal">
            <h2 class="lh-normal">We are waiting to assit you...</h2>
            <p>Simply call, emailor use the form below to get in touch</p>
          </div>
        </div>
      </div>
    </section>
    <!--top-->

    <div class="map-hold  pri-pad-b">
      <div class="overlay">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96708.3419418377!2d-74.03927127918426!3d40.75904032921492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2588f046ee661%3A0xa0b3281fcecc08c!2sManhattan%2C+New+York%2C+NY%2C+USA!5e0!3m2!1sen!2snp!4v1497343556535"
          width="600" height="550" frameborder="0" style="border:0" allowfullscreen></iframe>
      </div>
    </div>
    <!--map-->

    <div class="container">
      <div class="row">
        <div class="col-md-7 col-sm-7 contact-left left-block">
          <div class="content-wrap mb-50">
            <h3 class="lh-normal">Get in touch</h3>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.
            </p>
          </div>
          <!--top-->

          <div class="info-box">
            <div>
              <span class="fa fa-map-marker"></span>
              <h5 class="mb-10">Official Address</h5>
              <p>
                123 Third Street Fifth Avenue, Manhattan, New York, USA
              </p>
            </div>
            <!--address-->

            <div>
              <span class="fa fa-phone"></span>
              <h5 class="mb-10">Phone Number</h5>
              <p>
                1-800-3875-1234
              </p>
            </div>
            <!--address-->

            <div>
              <span class="fa fa-envelope"></span>
              <h5 class="mb-10">Email Address</h5>
              <p>
                <a href="#">info@yourdomain.com</a>
              </p>
            </div>
            <!--address-->
          </div>
        </div>
        <!--left block-->

        <div class="col-md-5 col-sm-5 contact-form">
          <div class="box box-shadow">
            <div class="box-title">
              <h4 class="lh-normal text-white mb-0">Say something for us...</h4>
            </div>
            <!--title-->

            <form action="#">
              <div class="form-group">
                <label>How would you like us to call you?</label>
                <input type="text" placeholder="Please write your name here">
              </div>
              <!--name-->

              <div class="form-group">
                <label>Which inbox should we reply on?</label>
                <input type="text" placeholder="Enter your email address here">
              </div>
              <!--email-->

              <div class="form-group">
                <label>How can we help you?</label>
                <textarea placeholder="Please write your message here"></textarea>
              </div>
              <!--message-->

              <div class="form-group">
                <button type="submit">
                  Send Message
                  <i class="fa fa-long-arrow-right"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
        <!--contact form-->
      </div>
    </div>
  </main>
</template>

<script>
export default {
  data () {
    return {}
  },
  methods: {}
}
</script>

<style scoped>
</style>
