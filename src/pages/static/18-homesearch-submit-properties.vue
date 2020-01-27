<template>
  <main class="pri-pad">
    <div class="container">
      <h3 class="mb-30">Submit Property</h3>

      <form action="#" class="property-submit">
        <h6 class="mb-15">Property Description and Price</h6>
        <div class="row mb-55">
          <div class="form-group col-sm-4 mb-30">
            <label>Property Title
              <span>*</span>
            </label>
            <input type="text">
          </div>
          <!--title-->

          <div class="form-group select col-sm-4 mb-30">
            <label>Property Type
              <span>*</span>
            </label>
            <select>
              <option>Apartment</option>
              <option>House</option>
            </select>
          </div>
          <!--type-->

          <div class="form-group select col-sm-4 mb-30">
            <label>Property Status
              <span>*</span>
            </label>
            <select>
              <option>For Rent</option>
              <option>For Sale</option>
            </select>
          </div>
          <!--status-->

          <div class="form-group col-sm-4 mb-30">
            <label>Location
              <span>*</span>
            </label>
            <input type="text">
          </div>
          <!--location-->

          <div class="form-group col-sm-4 mb-30">
            <label>Property ID</label>
            <input type="text">
          </div>
          <!--id-->

          <div class="form-group col-sm-4 mb-30">
            <label>Year built</label>
            <input type="text">
          </div>
          <!--year build-->

          <div class="form-group col-sm-4 mb-30">
            <label>Price
              <span>*</span>
            </label>
            <input type="text">
          </div>
          <!--price-->

          <div class="form-group col-sm-4 mb-30">
            <label>Prefix Price Label (ex: Starts From)</label>
            <input type="text">
          </div>
          <!--prefix-->

          <div class="form-group col-sm-4 mb-30">
            <label>After Price Label (ex: monthly)</label>
            <input type="text">
          </div>
          <!--after price-->

          <div class="form-group col-sm-12 mb-30">
            <label>Property Descriptions
              <span>*</span>
            </label>
            <textarea></textarea>
          </div>
        </div>
        <!--property description-->

        <h6 class="mb-15">Property Media</h6>
        <div class="row mb-55">
          <div class="form-group col-sm-6 mb-30">
            <label>Featured Image
              <span>*</span>
            </label>

            <div class="js">
              <input type="file" name="file-7[]" id="file-7" class="inputfile inputfile-6" data-multiple-caption="{count} files selected"
                multiple />
              <label for="file-7">
                <span class="text"></span>
                <span class="btn btn-lg">Browse</span>
              </label>
            </div>
          </div>
          <!--file-->

          <div class="form-group col-sm-6 mb-30">
            <label>Video URL</label>
            <input type="text">
          </div>
          <!--vide url-->

          <div class="form-group col-sm-12 mb-30">
            <label>Gallery Image</label>
            <div class="gallery-box text-center">
              <p>
                <i class="fa fa-cloud-upload"></i> Drag and drop images here</p>

              <span class="or">OR</span>

              <input type="file" name="file-1[]" id="file-1" class="inputfile inputfile-1" data-multiple-caption="{count} files selected"
                multiple="">
              <label for="file-1">
                <span class="btn btn-lg">Select Image</span>
              </label>
            </div>
          </div>
          <!--gallery image-->
        </div>
        <!--property media-->

        <h6 class="mb-15">Extra Information</h6>
        <div class="row mb-55">
          <div class="form-group col-sm-4 mb-30">
            <label>Bedrooms</label>
            <select>
              <option>&nbsp;</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          <!--bed rooms-->

          <div class="form-group col-sm-4 mb-30">
            <label>Bathrooms</label>
            <select>
              <option>&nbsp;</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          <!--bathroom-->

          <div class="form-group col-sm-4 mb-30">
            <label>Garages</label>
            <select>
              <option>&nbsp;</option>
              <option>1</option>
              <option>2</option>
              <option>3</option>
            </select>
          </div>
          <!--Garages-->

          <div class="form-group col-sm-4 mb-30">
            <label>Area (Sq/ft)</label>
            <input type="text">
          </div>
          <!--area-->

          <div class="form-group col-sm-4 mb-30">
            <label>Plot Size</label>
            <select>
              <option>&nbsp;</option>
            </select>
          </div>
          <!--Plot Size-->

          <div class="form-group col-sm-4 mb-30">
            <label>Parking</label>
            <select>
              <option>&nbsp;</option>
              <option>1</option>
              <option>2</option>
            </select>
          </div>
          <!--Parking-->
        </div>
        <!--extra info-->

        <h6 class="mb-15">Property Location</h6>
        <div class="row mb-55">
          <div class="form-group col-sm-4 mb-30">
            <label>Address</label>
            <input type="text">
          </div>
          <!--Address-->

          <div class="form-group col-sm-4 mb-30">
            <label>State</label>
            <select>
              <option>&nbsp;</option>
              <option>option 1</option>
              <option>option 2</option>
            </select>
          </div>
          <!--State-->

          <div class="form-group col-sm-4 mb-30">
            <label>Country</label>
            <select>
              <option>&nbsp;</option>
              <option>USA</option>
              <option>UK</option>
            </select>
          </div>
          <!--Country-->

          <div class="form-group col-sm-4 mb-30">
            <label>Postal Code / Zip</label>
            <input type="text">
          </div>
          <!--Postal Code / Zip-->

          <div class="form-group col-sm-4 mb-30">
            <label>Latitude</label>
            <input type="text">
          </div>
          <!--latitude-->

          <div class="form-group col-sm-4 mb-30">
            <label>Longitude</label>
            <input type="text">
          </div>
          <!--longitude-->

          <div class="col-sm-12 mb-30">
            <div class="map-hold">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d96708.3419418377!2d-74.03927127918426!3d40.75904032921492!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2588f046ee661%3A0xa0b3281fcecc08c!2sManhattan%2C+New+York%2C+NY%2C+USA!5e0!3m2!1sen!2snp!4v1497343556535"
                width="600" height="450"></iframe>
            </div>
          </div>
        </div>
        <!--Property Location-->

        <h6 class="mb-15">Floor Plan</h6>
        <div class="row mb-45">
          <div class="form-group col-sm-6 mb-30">
            <label>Image</label>
            <div class="js">
              <input type="file" name="file-8[]" id="file-8" class="inputfile inputfile-6" data-multiple-caption="{count} files selected"
                multiple />
              <label for="file-8">
                <span class="text"></span>
                <span class="btn btn-lg">Browse</span>
              </label>
            </div>
          </div>
          <!--plan 1-->

          <div class="form-group col-sm-6 mb-30">
            <label>Image</label>
            <div class="js">
              <input type="file" name="file-9[]" id="file-9" class="inputfile inputfile-6" data-multiple-caption="{count} files selected"
                multiple />
              <label for="file-9">
                <span class="text"></span>
                <span class="btn btn-lg">Browse</span>
              </label>
            </div>
          </div>
          <!--plan 2-->

          <div class="form-group col-sm-6 mb-30">
            <label>Image</label>
            <div class="js">
              <input type="file" name="file-10[]" id="file-10" class="inputfile inputfile-6" data-multiple-caption="{count} files selected"
                multiple />
              <label for="file-10">
                <span class="text"></span>
                <span class="btn btn-lg">Browse</span>
              </label>
            </div>
          </div>
          <!--plan 3-->

          <div class="form-group col-sm-6 mb-30">
            <label>Image</label>
            <div class="js">
              <input type="file" name="file-11[]" id="file-11" class="inputfile inputfile-6" data-multiple-caption="{count} files selected"
                multiple />
              <label for="file-11">
                <span class="text"></span>
                <span class="btn btn-lg">Browse</span>
              </label>
            </div>
          </div>
          <!--plan 4-->
        </div>
        <!--floor plan-->

        <h6 class="mb-15">Property Features</h6>
        <div class="row mb-60">
          <div class="form-group col-sm-12">
            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Air Conditioning</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Built-In Wardrobes</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Clinic</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Dishwasher</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Fencing</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Floor Coverings</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Internet</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Park</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>School</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Supermarket/Store</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Transportation Hub</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Balcony</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Bedding</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Cable TV</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Cleaning after exit</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Cofee pot</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Computer</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Cot</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Dishwasher</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>DVD</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Fan</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Fridge</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Grill</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Hairdryer</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Heating</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Hi-fi</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Iron</span>
            </div>

            <div class="checkbox-wrap">
              <input type="checkbox">
              <span>Juicer</span>
            </div>
          </div>
        </div>
        <!-- Property Features-->

        <h6 class="mb-15">Agent Details</h6>
        <div class="row">
          <div class="form-group col-sm-4 mb-30">
            <label>Contact Person/Company Name</label>
            <input type="text">
          </div>
          <!--contact person-->

          <div class="form-group col-sm-4 mb-30">
            <label>Address</label>
            <input type="text">
          </div>
          <!--address-->

          <div class="form-group col-sm-4 mb-30">
            <label>Email</label>
            <input type="text">
          </div>
          <!--email-->

          <div class="form-group col-sm-4 mb-30">
            <label>Phone</label>
            <input type="text">
          </div>
          <!--Phone-->

          <div class="form-group col-sm-4 mb-30">
            <label>Worrking Hours</label>
            <input type="text">
          </div>
          <!--Worrking Hours-->
        </div>
        <!--agent detail-->

        <a href="#" class="btn btn-sucess btn-lg shadow faa-parent animated-hover">
          Submit Property
          <i class="fa fa-long-arrow-right faa-passing"></i>
        </a>
      </form>
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
