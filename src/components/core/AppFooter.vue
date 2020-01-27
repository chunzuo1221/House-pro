<template>
  <footer>
    <div class="footer-top pri-pad">
      <div class="container">
        <div class="row">
          <div class="col-md-4 col-sm-4 left-block">
            <a href="#">
              <img src="/static/images/logo-housepro-white.png" alt="">
            </a>
            <div class="content-wrap mb-30">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took. Lorem Ipsum has been the industry's loem ipsum is
                a dummy text standard dummy text ever since the 1500s, when an unknown printer took.
              </p>
            </div>
            <!--content-->

            <div class="extra-info">
              <a href="tel:+180038751234" class="faa-parent animated-hover">
                <i class="fa fa-phone faa-passing"></i> 1-800-3875-1234
              </a>
              <a href="mailto:info@yourdomain.com" class="faa-parent animated-hover">
                <i class="fa fa-envelope faa-passing"></i> info@yourdomain.com
              </a>
            </div>
          </div>
          <!--left-->

          <div class="col-md-4 col-sm-4 mid-block">
            <h5>Latest from the blog</h5>
            <ul class="footer-blog">
              <li>
                <span class="date primary-color"> 12-April-2016 </span>
                <a href="#">
                  Lorem Ipsum is simply dummy text of the print and typesetting industry.
                </a>
              </li>
              <!--single blog-->

              <li>
                <span class="date primary-color"> 12-April-2016 </span>
                <a href="#">
                  Lorem Ipsum is simply dummy text of the print and typesetting industry.
                </a>
              </li>
              <!--single blog-->

              <li>
                <span class="date primary-color"> 12-April-2016 </span>
                <a href="#">
                  Lorem Ipsum is simply dummy text of the print and typesetting industry.
                </a>
              </li>
              <!--single blog-->
            </ul>
          </div>
          <!--mid-->

          <div class="col-md-2 col-sm-2 mid-block">
            <h5>Quick links</h5>
            <ul class="footer-link">
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">Transactions </a>
              </li>
              <li>
                <a href="#">Create Property </a>
              </li>
              <li>
                <a href="#">My Properties </a>
              </li>
              <li>
                <a href="#">Agents </a>
              </li>
              <li>
                <a href="#">Blog </a>
              </li>
              <li>
                <a href="#">Register </a>
              </li>
              <li>
                <a href="#">Login </a>
              </li>
            </ul>
          </div>
          <!--mid-->

          <div class="col-md-2 col-sm-2">
            <h5>Top locations</h5>
            <ul class="footer-link">
              <li>
                <a href="#">New York</a>
              </li>
              <li>
                <a href="#">Washington, D.C. </a>
              </li>
              <li>
                <a href="#">South Carolina</a>
              </li>
              <li>
                <a href="#"> Los Angeles</a>
              </li>
              <li>
                <a href="#">New York </a>
              </li>
              <li>
                <a href="#">Washington, D.C. </a>
              </li>
              <li>
                <a href="#">South Carolina</a>
              </li>
              <li>
                <a href="#"> Los Angeles</a>
              </li>
            </ul>
          </div>
          <!--mid-->
        </div>
      </div>
    </div>
    <!--footer top-->

    <div class="footer lh-normal">
      <div class="container">
        <div class="row">
          <div class="col-md-6 col-sm-6 left-block">
            &copy; 2017 HomeSearch. All rights reserved. (build {{buildNumber}})
          </div>

          <div class="col-md-6 col-sm-6">
            <ul class="social-icons pull-right">
              <li>
                <a href="#">
                  <i class="fa fa-facebook"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="fa fa-twitter"></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="fa fa-instagram "></i>
                </a>
              </li>
              <li>
                <a href="#">
                  <i class="fa fa-linkedin"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter',
  data () {
    return {
      buildNumber: ''
    }
  },
  mounted () {
    this.buildNumber = process.env.BUILD_NUMBER
  }
}
</script>
