<template>
  <main>
    <div class="filter-bar filter-bar-2 primary-bg text-white">
      <div class="container">
        <div class="row">
          <div class="col-md-12 col-sm-12">
            <form action="#" class="form-inline">
              <div class="form-group">
                <input type="text" placeholder="Enter Keywords">
              </div>
              <!--keyword-->

              <div class="form-group select">
                <label>Location</label>
                <select>
                  <option>New York</option>
                  <option>Los Angeles</option>
                  <option>South Carolina</option>
                </select>
              </div>
              <!--location-->

              <div class="form-group select">
                <label>property type</label>
                <select>
                  <option>Apartment</option>
                  <option>House</option>
                </select>
              </div>
              <!--type-->

              <div class="form-group select">
                <label>Min Price</label>
                <select>
                  <option>any Price</option>
                </select>
              </div>
              <!-- min price-->

              <div class="form-group select">
                <label>Max Price</label>
                <select>
                  <option>any Price</option>
                </select>
              </div>
              <!--max price-->

              <div class="form-group">
                <button type="submit">
                  Start Search
                  <i class="fa fa-long-arrow-right"></i>
                </button>
              </div>
              <!--max price-->
            </form>
          </div>
        </div>
      </div>
    </div>
    <!--filter bar-->

    <div class="gallery-wrap full">
      <div class="banner-content">
        <div class="container">
          <span class="tag left text-uppercase primary-bg text-white">for rent</span>
          <div class="title text-white">
            <h2 class="mb-0 lh-normal text-white">Gardening Eve 1201</h2> New York / Manhattan
            <span class="price primary-bg text-white">$570000</span>
          </div>
        </div>
      </div>

      <ul class="gallery-full">
        <li>
          <figure class="text-center overlay overlay2">
            <img src="/static/images/gal-full-1.jpg" alt="">
          </figure>
        </li>
        <li>
          <figure class="text-center overlay overlay2">
            <img src="/static/images/gal-full-2.jpg" alt="">
          </figure>
        </li>
        <li>
          <figure class="text-center overlay overlay2">
            <img src="/static/images/gal-full-3.jpg" alt="">
          </figure>
        </li>
        <li>
          <figure class="text-center overlay overlay2">
            <img src="/static/images/gal-full-4.jpg" alt="">
          </figure>
        </li>
      </ul>
    </div>
    <!--gallery wrap-->

    <section class="pri-pad">
      <div class="container">
        <div class="row">
          <div class="col-md-9 col-sm-9 property-single left-block ">
            <div class="box border mb-40 requtest-form">
              <form action="#">
                <div class="left">
                  <div class="form-group">
                    <input type="text" placeholder="Full Name">
                  </div>
                  <!--name-->

                  <div class="form-group">
                    <input type="text" placeholder="Email Address">
                  </div>
                  <!--address-->

                  <div class="form-group">
                    <input type="text" placeholder="Phone Number">
                  </div>
                  <!--address-->
                </div>
                <!--left-->

                <div class="right">
                  <div class="form-group">
                    <textarea placeholder="I am interested in this Gardening Eve 1201  for rent at New York / Manhattan, priced at $139,950."></textarea>
                  </div>
                </div>
                <!--right-->

                <div class="right checkbox-wrap">
                  <input type="checkbox">
                  <span>I'm happy to receive emails from Home Search & specially selected agents. </span>
                </div>
                <!--right-->

                <div class="left">
                  <div class="form-group">
                    <button type="submit">
                      Request Details
                      <i class="fa fa-long-arrow-right"></i>
                    </button>
                  </div>
                </div>
                <!--left-->
              </form>
              <div class="clearfix"></div>
            </div>
            <!--request form-->

            <div class="row mb-40">
              <div class="col-sm-4 left-block ppt-info">
                <div class="box border">
                  <div class="box-title">
                    <h6 class="mb-0 lh-normal">Property Informations</h6>
                  </div>
                  <div class="detail info">
                    <ul>
                      <li>Area
                        <span>1200sq/ft </span>
                      </li>
                      <li>Bathrooms
                        <span>6</span>
                      </li>
                      <li>Bedrooms
                        <span>6</span>
                      </li>
                      <li>Floors
                        <span>4</span>
                      </li>
                      <li>Area
                        <span>1200sq/ft </span>
                      </li>
                      <li>Bathrooms
                        <span>6</span>
                      </li>
                      <li>Bedrooms
                        <span>6</span>
                      </li>
                      <li>Floors
                        <span>4</span>
                      </li>
                      <li>Area
                        <span>1200sq/ft </span>
                      </li>
                      <li>Bathrooms
                        <span>6</span>
                      </li>
                      <li>Bedrooms
                        <span>6</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <!--property-desc-->

              <div class="col-sm-8 ppt-desc">
                <div class="box border content-wrap mb-0">
                  <h4 class="title mb-20">Property Descriptions</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque
                    penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque
                    eu, pretium quis, sem. Nulla consequat massa quis enim.
                  </p>
                  <p>
                    Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                    justo. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus.
                    Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.
                  </p>
                  <p>
                    Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,
                    justo. Integer tincidunt. Cras dapibus.
                  </p>
                </div>
              </div>
              <!--property-desc-->
            </div>
            <!--property detail-->

            <div class="box border mb-40">
              <h4 class="title mb-20">Amenities</h4>
              <ul class="amenities">
                <li>Air Conditioning </li>
                <li>Built-In Wardrobes </li>
                <li>Clinic </li>
                <li>Dishwasher</li>
                <li>Fencing </li>
                <li>Floor Covering </li>
                <li>Internet</li>
                <li>Park</li>
                <li>School </li>
                <li>Supermarket/Store </li>
                <li>Transportation Hub</li>
              </ul>
            </div>
            <!--aminities-->

            <div class="box border mb-40">
              <h4 class="title mb-20">Floor Plans</h4>
              <div class="row light-box-gallery">
                <a href="/static/images/floor1.jpg" data-toggle="lightbox" data-gallery="example-gallery" class="col-sm-3">
                  <img src="/static/images/floor1.jpg" class="img-fluid">
                </a>

                <a href="/static/images/floor2.jpg" data-toggle="lightbox" data-gallery="example-gallery" class="col-sm-3">
                  <img src="/static/images/floor2.jpg" class="img-fluid">
                </a>

                <a href="/static/images/floor3.jpg" data-toggle="lightbox" data-gallery="example-gallery" class="col-sm-3">
                  <img src="/static/images/floor3.jpg" class="img-fluid">
                </a>

                <a href="/static/images/floor4.jpg" data-toggle="lightbox" data-gallery="example-gallery" class="col-sm-3">
                  <img src="/static/images/floor4.jpg" class="img-fluid">
                </a>
              </div>
            </div>
            <!--floor plan-->

            <div class="box border mb-40">
              <h4 class="title mb-20">Location Map</h4>
              <div class="map-hold overlay">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96708.3419418377!2d-74.03927127918426!3d40.75904032921492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2588f046ee661%3A0xa0b3281fcecc08c!2sManhattan%2C+New+York%2C+NY%2C+USA!5e0!3m2!1sen!2snp!4v1497343556535"
                  width="600" height="400" frameborder="0" style="border:0" allowfullscreen></iframe>
              </div>
            </div>
            <!--map hold-->

            <div class="box border agent-box  bg-dark">
              <h4 class="title mb-20 text-white">Agent Details</h4>
              <div class="wrap">
                <figure>
                  <img src="/static/images/box-agent.jpg" alt="">
                </figure>
                <div class="content-wrap mb-0 text-white">
                  <h6 class="font-primary text-white">
                    Wyeessie K Normu
                    <span>1702 Goodwin Avenue, Richland, WA 99352</span>
                  </h6>

                  <ul class="info">
                    <li>E-mail : sample@example.com </li>
                    <li>Web : http://example.com</li>
                    <li>Phone : +0-123-456-789 </li>
                    <li>Company : Integra Investment Service </li>
                    <li>Listings : 3</li>
                  </ul>

                  <ul class="social-icons">
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
            <!--agent detail-->
          </div>
          <!--left block-->

          <div class="col-md-3 col-sm-3 sidebar">
            <div class="alert-message sidebar-form mb-20 ">
              <h6>Get daily property email alert in your inbox</h6>
              <form action="#">
                <div class="form-group">
                  <input type="text" placeholder="Enter your email address">
                </div>
                <!--text-->

                <div class="form-group">
                  <button type="submit">
                    create alert
                    <i class="fa fa-long-arrow-right"></i>
                  </button>
                </div>
              </form>
            </div>
            <!--alert-->

            <div class="sidebar-filter sidebar-form">
              <h6 class="title">Find your home</h6>
              <form action="#">
                <div class="form-group">
                  <input type="text" placeholder="Enter search keyword ">
                </div>
                <!--keyword-->

                <div class="form-group select">
                  <select>
                    <option>Select Status </option>
                  </select>
                </div>
                <!--status-->

                <div class="form-group select">
                  <select>
                    <option>Select Location</option>
                  </select>
                </div>
                <!--location-->

                <div class="form-group select">
                  <select>
                    <option>Select Types </option>
                  </select>
                </div>
                <!--type-->

                <div class="form-group select">
                  <select>
                    <option>No. of Bedrooms</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                </div>
                <!--bed room-->

                <div class="form-group select">
                  <select>
                    <option>No. of Bathrooms</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                </div>
                <!--bathroom-->

                <div class="form-group select">
                  <select>
                    <option>No. of Floors</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                </div>
                <!--floors-->

                <div class="form-group range">
                  <label>Price range</label>
                  <div id="slider-range"></div>
                  <input type="hidden" id="amount1">
                  <input type="hidden" id="amount2">
                  <div id="amount"></div>
                </div>
                <!--price-->

                <div class="form-group range">
                  <label>Area</label>
                  <div id="area-range"></div>
                  <input type="hidden" id="area1">
                  <input type="hidden" id="area2">
                  <div id="area"></div>
                </div>
                <!--area-->

                <div class="form-group">
                  <button type="submit">
                    Start Search
                    <i class="fa fa-long-arrow-right"></i>
                  </button>
                </div>
              </form>
            </div>
            <!--filter-->
          </div>
          <!--sidebar-->
        </div>
      </div>
    </section>
    <!--property wrap-->
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
