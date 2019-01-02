var documenterSearchIndex = {"docs": [

{
    "location": "#",
    "page": "ImageContrastAdjustment.jl Documentation",
    "title": "ImageContrastAdjustment.jl Documentation",
    "category": "page",
    "text": ""
},

{
    "location": "#ImageContrastAdjustment.jl-Documentation-1",
    "page": "ImageContrastAdjustment.jl Documentation",
    "title": "ImageContrastAdjustment.jl Documentation",
    "category": "section",
    "text": ""
},

{
    "location": "#ImageContrastAdjustment.build_histogram",
    "page": "ImageContrastAdjustment.jl Documentation",
    "title": "ImageContrastAdjustment.build_histogram",
    "category": "function",
    "text": "edges, count = build_histogram(img, nbins)\nedges, count = build_histogram(img, nbins; minval, maxval)\nedges, count = build_histogram(img, edges)\n\nGenerates a histogram for the image over nbins spread between [minval, maxval]. Color images are automatically converted to grayscale.\n\nOutput\n\nReturns edges which is a AbstractRange type that specifies how the  interval [minval, maxval] is divided into bins, and an array count which records the concomitant bin frequencies. In particular, count has the following properties:\n\ncount[0] is the number satisfying x < edges[1]\ncount[i] is the number of values x that satisfy edges[i] <= x < edges[i+1]\ncount[end] is the number satisfying x >= edges[end].\nlength(count) == length(edges)+1.\n\nDetails\n\nOne can consider a histogram as a piecewise-constant model of a probability density function f [1]. Suppose that f has support on some interval I = ab.  Let m be an integer and a = a_1  a_2  ldots  a_m  a_m+1 = b a sequence of real numbers. Construct a sequence of intervals\n\nI_1 = a_1a_2 I_2 = (a_2 a_3 ldots I_m = (a_ma_m+1\n\nwhich partition I into subsets I_j (j = 1 ldots m) on which f is constant. These subsets satisfy I_i cap I_j = emptyset forall i neq j, and are commonly referred to as bins. Together they encompass the entire range of data values such that sum_j I_j  =  I . Each bin has width w_j = I_j = a_j+1 - a_j and height h_j which is the constant probability density over the region of the bin. Integrating the constant probability density over the width of the bin w_j yields a probability mass of pi_j = h_j w_j for the bin.\n\nFor a sample x_1 x_2 ldots x_N, let\n\nn_j = sum_n = 1^Nmathbf1_(I_j)(x_n)\nquad textwhere quad\nmathbf1_(I_j)(x) =\nbegincases\n 1  textif x in I_j\n 0  textotherwise\nendcases\n\nrepresents the number of samples falling into the interval I_j. An estimate for the probability mass of the jth bin is given by the relative frequency hatpi = fracn_jN, and the histogram estimator of the probability density function is defined as\n\nbeginaligned\nhatf_n(x)   = sum_j = 1^mfracn_jNw_j mathbf1_(I_j)(x) \n = sum_j = 1^mfrachatpi_jw_j mathbf1_(I_j)(x) \n = sum_j = 1^mhath_j mathbf1_(I_j)(x)\nendaligned\n\nThe function hatf_n(x) is a genuine density estimator because hatf_n(x)  ge 0 and\n\nbeginaligned\nint_-infty^inftyhatf_n(x) operatornamedx  = sum_j=1^m fracn_jNw_j w_j \n = 1\nendaligned\n\nOptions\n\nVarious options for the parameters of this function are described in more detail below.\n\nChoices for nbins\n\nYou can specify the number of discrete bins for the histogram. When specifying the number of bins consider the maximum number of greylevels that your image type supports. For example, with an image of type N0f8 there is a maximum of 256 possible graylevels. Hence, if you request more than 256 bins for that type of image you should expect to obtain zero counts for numerous bins.\n\nChoices for minval\n\nYou have the option to specify the lower bound of the interval over which the histogram will be computed.  If minval is not specified then the minimum value present in the image is taken as the lower bound.\n\nChoices for maxval\n\nYou have the option to specify the upper bound of the interval over which the histogram will be computed.  If maxval is not specified then the maximum value present in the image is taken as the upper bound.\n\nChoices for edges\n\nIf you do not designate the number of bins, nor the lower or upper bound of the interval, then you have the option to directly stipulate how the intervals will be divided by specifying a AbstractRange type.\n\nExample\n\nCompute the histogram of a grayscale image.\n\n\nusing TestImages, FileIO, ImageView\n\nimg =  testimage(\"mandril_gray\");\nedges, counts  = build_histogram(img, 256, minval = 0, maxval = 1)\n\nGiven a color image, compute the histogram of the red channel.\n\nimg = testimage(\"mandrill\")\nr = red.(img)\nedges, counts  = build_histogram(r, 256, minval = 0, maxval = 1)\n\nReferences\n\n[1] E. Herrholz, \"Parsimonious Histograms,\" Ph.D. dissertation, Inst. of Math. and Comp. Sci., University of Greifswald, Greifswald, Germany, 2011.\n\nSee also:\n\nOperation Function Name In-place Variant\nHistogram Equalization adjust_histogram adjust_histogram!\nHistogram Matching adjust_histogram adjust_histogram!\nGamma Correction adjust_histogram adjust_histogram!\nLinear Stretching adjust_histogram adjust_histogram!\nContrast Stretching adjust_histogram adjust_histogram!\n\n\n\n\n\n"
},

{
    "location": "#ImageContrastAdjustment.adjust_histogram-Tuple{Equalization,AbstractArray,Integer}",
    "page": "ImageContrastAdjustment.jl Documentation",
    "title": "ImageContrastAdjustment.adjust_histogram",
    "category": "method",
    "text": "adjust_histogram(Equalization(),img, nbins)\nadjust_histogram(Equalization(),img, nbins; minval, maxval)\n\nReturns a histogram equalised image with a granularity of nbins number of bins.\n\nDetails\n\nHistogram equalisation was initially conceived to  improve the contrast in a single-channel grayscale image. The method transforms the distribution of the intensities in an image so that they are as uniform as possible [1]. The natural justification for uniformity is that the image has better contrast  if the intensity levels of an image span a wide range on the intensity scale. As it turns out, the necessary transformation is a mapping based on the cumulative histogram.\n\nOne can consider an L-bit single-channel I times J image with gray values in the set 01ldotsL-1 , as a collection of independent and identically distributed random variables. Specifically, let the sample space Omega be the set of all IJ-tuples omega =(omega_11omega_12ldotsomega_1Jomega_21omega_22ldotsomega_2Jomega_I1omega_I2ldotsomega_IJ), where each omega_ij in 01ldots L-1 . Furthermore, impose a probability measure on Omega such that the functions Omega ni omega to omega_ij in 01ldotsL-1 are independent and identically distributed.\n\nOne can then regard an image as a matrix of random variables mathbfG = G_ij(omega), where each function G_ij Omega to mathbbR is defined by\n\nG_ij(omega) = fracomega_ijL-1\n\nand each G_ij is distributed according to some unknown density f_G. While f_G is unknown, one can approximate it with a normalised histogram of gray levels,\n\nhatf_G(v)= fracn_vIJ\n\nwhere\n\nn_v = left  left(ij)   G_ij(omega)  = v right  right \n\nrepresents the number of times a gray level with intensity v occurs in mathbfG. To transforming the distribution of the intensities so that they are as uniform as possible one needs to find a mapping T(cdot) such that T(G_ij) thicksim U. The required mapping turns out to be the cumulative distribution function (CDF) of the empirical density hatf_G,\n\n T(G_ij) = int_0^G_ijhatf_G(w)mathrmd w\n\nOptions\n\nVarious options for the parameters of this function are described in more detail below.\n\nChoices for img\n\nThe adjust_histogram(Equalization(),...) function can handle a variety of input types.  The type of the returned image matches the input type.\n\nFor coloured images, the input is converted to YIQ type and the Y channel is equalised. This is the combined with the I and Q channels and the resulting image converted to the same type as the input.\n\nChoices for nbins\n\nYou can specify the total number of bins in the histogram.\n\nChoices for minval and maxval\n\nIf minval and maxval are specified then intensities are equalized to the range [minval, maxval]. The default values are 0 and 1.\n\nExample\n\n\nusing TestImages, FileIO, ImageView\n\nimg =  testimage(\"mandril_gray\")\nimgeq = adjust_histogram(Equalization(),img,256, minval = 0, maxval = 1)\n\nimshow(img)\nimshow(imgeq)\n\nReferences\n\nR. C. Gonzalez and R. E. Woods. Digital Image Processing (3rd Edition).  Upper Saddle River, NJ, USA: Prentice-Hall,  2006.\n\nSee also:\n\nOperation Function Name In-place Variant\nHistogram Construction build_histogram \nHistogram Matching adjust_histogram adjust_histogram!\nGamma Correction adjust_histogram adjust_histogram!\nLinear Stretching adjust_histogram adjust_histogram!\nContrast Stretching adjust_histogram adjust_histogram!\n\n\n\n\n\n"
},

{
    "location": "#ImageContrastAdjustment.adjust_histogram!-Tuple{Equalization,AbstractArray,Integer}",
    "page": "ImageContrastAdjustment.jl Documentation",
    "title": "ImageContrastAdjustment.adjust_histogram!",
    "category": "method",
    "text": "adjust_histogram!(Equalization(),img, nbins)\nadjust_histogram!(Equalization(),img, nbins; minval, maxval)\n\nSame as adjust_histogram except that it modifies the image that was passed as an argument.\n\n\n\n\n\n"
},

{
    "location": "#ImageContrastAdjustment.adjust_histogram-Tuple{Matching,AbstractArray,AbstractArray,Integer}",
    "page": "ImageContrastAdjustment.jl Documentation",
    "title": "ImageContrastAdjustment.adjust_histogram",
    "category": "method",
    "text": "adjust_histogram(Matching(),img, targetimg, nbins)\nadjust_histogram(Matching(),img, targetimg, edges)\n\nReturns a histogram matched image with a granularity of nbins number of bins. The first argument img is the image to be matched, and the second argument targetimg is the image having the desired histogram to be matched to.\n\nDetails\n\nThe purpose of histogram matching is to transform the intensities in a source image so that the intensities distribute according to the histogram of a specified target image. If one interprets histograms as piecewise-constant models of probability density functions (see build_histogram), then the histogram matching task can be modelled as the problem of transforming one probability distribution into another [1]. It turns out that the solution to this transformation problem involves the cumulative and inverse cumulative distribution functions of the source and target probability density functions.\n\nIn particular, let the random variables x thicksim p_x and z thicksim p_z  represent an intensity in the source and target image respectively, and let\n\n S(x) = int_0^xp_x(w)mathrmd w quad textand quad\n T(z) = int_0^zp_z(w)mathrmd w\n\nrepresent their concomitant cumulative disitribution functions. Then the sought-after mapping Q(cdot) such that Q(x) thicksim p_z is given by\n\nQ(x) =  T^-1left( S(x) right)\n\nwhere T^-1(y) = operatornamemin  x in mathbbR  y leq T(x)  is the inverse cumulative distribution function of T(x).\n\nThe mapping suggests that one can conceptualise histogram matching as performing histogram equalisation on the source and target image and relating the two equalised histograms. Refer to adjust_histogram for more details on histogram equalisation.\n\nOptions\n\nVarious options for the parameters of this function are described in more detail below.\n\nChoices for img and targetimg\n\nThe adjust_histogram(Matching(),...) function can handle a variety of input types. The type of the returned image matches the input type.\n\nFor colored images, the inputs are converted to YIQ  type and the distributions of the Y channels are matched. The modified Y channel is then combined with the I and Q channels and the resulting image converted to the same type as the input.\n\nChoices for nbins\n\nYou can specify the total number of bins in the histogram. If you do not specify the number of bins then a default value of 256 bins is utilised.\n\nChoices for edges\n\nIf you do not designate the number of bins, then you have the option to directly stipulate how the intervals will be divided by specifying a AbstractRange type.\n\nExample\n\nusing Images, TestImages, ImageView\n\nimg_source = testimage(\"mandril_gray\")\nimg_target = adjust_gamma(img_source, 1/2)\nimg_transformed = adjust_histogram(Matching(),img_source, img_target)\n#=\n    A visual inspection confirms that img_transformed resembles img_target\n    much more closely than img_source.\n=#\nimshow(img_source)\nimshow(img_target)\nimshow(img_transformed)\n\nReferences\n\nW. Burger and M. J. Burge. Digital Image Processing. Texts in Computer Science, 2016. doi:10.1007/978-1-4471-6684-9\n\nSee also:\n\nOperation Function Name In-place Variant\nHistogram Construction build_histogram \nHistogram Equalization adjust_histogram adjust_histogram!\nGamma Correction adjust_histogram adjust_histogram!\nLinear Stretching adjust_histogram adjust_histogram!\nContrast Stretching adjust_histogram adjust_histogram!\n\n\n\n\n\n"
},

{
    "location": "#ImageContrastAdjustment.adjust_histogram!-Tuple{Matching,AbstractArray,AbstractArray,Integer}",
    "page": "ImageContrastAdjustment.jl Documentation",
    "title": "ImageContrastAdjustment.adjust_histogram!",
    "category": "method",
    "text": "adjust_histogram!(Matching(),img, targetimg, nbins)\nadjust_histogram!(Matching(),img, targetimg, edges)\n\nSame as  adjust_histogram  except that it modifies the image that was passed as an argument.\n\n\n\n\n\n"
},

{
    "location": "#ImageContrastAdjustment.adjust_histogram-Tuple{GammaCorrection,AbstractArray,Real}",
    "page": "ImageContrastAdjustment.jl Documentation",
    "title": "ImageContrastAdjustment.adjust_histogram",
    "category": "method",
    "text": "adjust_histogram(GammaCorrection(),img, gamma)\n\nReturns a gamma corrected image.\n\nDetails\n\nGamma correction is a non-linear  transformation given by the relation\n\nf(x) = x^gamma quad textfor  x in mathbbR gamma  0\n\nIt is called a power law transformation because one quantity varies as a power of another quantity.\n\nGamma correction has historically been used to preprocess an image to compensate for the fact that the intensity of light generated by a physical device is not usually a linear function of the applied signal but instead follows a power law [1]. For example, for many Cathode Ray Tubes (CRTs) the emitted light intensity on the display is approximately equal to the voltage raised to the power of γ, where γ ∈ [1.8, 2.8]. Hence preprocessing a raw image with an exponent of 1/γ  would have ensured a linear response to brightness.\n\nResearch in psychophysics has also established an empirical  power law   between light intensity and perceptual brightness. Hence, gamma correction often serves as a useful image enhancement tool.\n\nOptions\n\nVarious options for the parameters of this function are described in more detail below.\n\nChoices for img\n\nThe function can handle a variety of input types. The returned image depends on the input type.\n\nFor coloured images, the input is converted to YIQ type and the Y channel is gamma corrected. This is the combined with the I and Q channels and the resulting image converted to the same type as the input.\n\nChoice for gamma\n\nThe gamma value must be a non-zero positive number. A gamma value less than one will yield a brighter image whereas a value greater than one will produce a darker image. If left unspecified a default value of one is assumed.\n\nExample\n\nusing ImageContrastAdjustment, ImageView\n\n# Create an example image consisting of a linear ramp of intensities.\nn = 32\nintensities = 0.0:(1.0/n):1.0\nimg = repeat(intensities, inner=(20,20))\'\n\n# Brighten the dark tones.\nimgadj = adjust_histogram(GammaCorrection(), img, 1/2)\n\n# Display the original and adjusted image.\nimshow(img)\nimshow(imgadj)\n\nReferences\n\nW. Burger and M. J. Burge. Digital Image Processing. Texts in Computer Science, 2016. doi:10.1007/978-1-4471-6684-9\n\nSee also:\n\nOperation Function Name In-place Variant\nHistogram Construction build_histogram \nHistogram Equalization adjust_histogram adjust_histogram!\nHistogram Matching adjust_histogram adjust_histogram!\nLinear Stretching adjust_histogram adjust_histogram!\nContrast Stretching adjust_histogram adjust_histogram!\n\n\n\n\n\n"
},

{
    "location": "#ImageContrastAdjustment.adjust_histogram!-Tuple{GammaCorrection,AbstractArray,Real}",
    "page": "ImageContrastAdjustment.jl Documentation",
    "title": "ImageContrastAdjustment.adjust_histogram!",
    "category": "method",
    "text": "adjust_histogram!(GammaCorrection(),img, gamma)\n\nSame as adjust_histogram except that it modifies the image that was passed as an argument.\n\n\n\n\n\n"
},

{
    "location": "#ImageContrastAdjustment.adjust_histogram-Tuple{LinearStretching,AbstractArray}",
    "page": "ImageContrastAdjustment.jl Documentation",
    "title": "ImageContrastAdjustment.adjust_histogram",
    "category": "method",
    "text": "adjust_histogram(LinearStretching(), img; minval = 0, maxval = 1)\n\nReturns an image where the range of the intensities spans the interval [minval, maxval].\n\nDetails\n\nLinear stretching (also called normalization) is a contrast enhancing transformation that is used to modify the dynamic range of the image. In particular, suppose that the input image has gray values in the range [A,B] and one wishes to change the dynamic range to [a,b] using a linear mapping, then the necessary transformation is given by the relation\n\nf(x) = (x-A) fracb-aB-A + a\n\nOptions\n\nVarious options for the parameters of this function are described in more detail below.\n\nChoices for img\n\nThe function can handle a variety of input types. The returned image depends on the input type.\n\nFor colored images, the input is converted to the YIQ  type and the intensities of the Y channel are stretched to the specified range. The modified Y channel is then combined with the I and Q channels and the resulting image converted to the same type as the input.\n\nChoices for minval and maxval\n\nIf minval and maxval are specified then intensities are mapped to the range [minval, maxval]. The default values are 0 and 1.\n\nExample\n\nusing ImageContrastAdjustment, ImageView, TestImages, Images\n\nimg = testimage(\"mandril_gray\")\nimgo = adjust_histogram(LinearStretching(),img, minval = 0, maxval = 1)\n\n\nReferences\n\nW. Burger and M. J. Burge. Digital Image Processing. Texts in Computer Science, 2016. doi:10.1007/978-1-4471-6684-9\n\nSee also:\n\nOperation Function Name In-place Variant\nHistogram Construction build_histogram \nHistogram Equalization adjust_histogram adjust_histogram!\nHistogram Matching adjust_histogram adjust_histogram!\nGamma Correction adjust_histogram adjust_histogram!\nContrast Stretching adjust_histogram adjust_histogram!\n\n\n\n\n\n"
},

{
    "location": "#ImageContrastAdjustment.adjust_histogram!-Tuple{LinearStretching,AbstractArray}",
    "page": "ImageContrastAdjustment.jl Documentation",
    "title": "ImageContrastAdjustment.adjust_histogram!",
    "category": "method",
    "text": "adjust_histogram!(LinearStretching(), img; minval = 0.0, maxval = 1.0)\n\nSame as adjust_histogram except that it modifies the image that was passed as an argument.\n\n\n\n\n\n"
},

{
    "location": "#ImageContrastAdjustment.adjust_histogram-Tuple{ContrastStretching,AbstractArray}",
    "page": "ImageContrastAdjustment.jl Documentation",
    "title": "ImageContrastAdjustment.adjust_histogram",
    "category": "method",
    "text": "adjust_histogram(ContrastStretching(), img; t = 0.5,  slope = 1.0)\n\nReturns an image where intensities intensities below t are compressed into a narrower range of dark intensities, and values above t are compressed into a narrower band of light intensities.\n\nDetails\n\nContrast stretching is a transformation that  enhances or reduces (for slope > 1 or < 1, respectively) the contrast near saturation (0 and 1). It is given by the relation\n\nf(x) = frac11 + left(fractx right)^s  s in mathbbR\n\nwhere s represents the slope argument.\n\nOptions\n\nVarious options for the parameters of this function are described in more detail below.\n\nChoices for img\n\nThe function can handle a variety of input types. The returned image depends on the input type.\n\nFor colored images, the input is converted to the YIQ  type and the intensities of the Y channel are stretched to the specified range. The modified Y channel is then combined with the I and Q channels and the resulting image converted to the same type as the input.\n\nChoice for t\n\nThe value of t needs to be in the unit interval. If left unspecified a default value of 0.5 is utilised.\n\nChoice for slope\n\nThe value of slope can be any real number. If left unspecified a default value of 1.0 is utilised.\n\nExample\n\nusing ImageContrastAdjustment, ImageView, Images, TestImages\n\nimg = testimage(\"mandril_gray\")\nret = adjust_histogram(ContrastStretching(),img, t = 0.6, slope = 3)\n\n\nReferences\n\nGonzalez, R. C., Woods, R. E., & Eddins, S. L. (2004). Digital image processing using MATLAB (Vol. 624). Upper Saddle River, New Jersey: Pearson-Prentice-Hall.\n\nSee also:\n\nOperation Function Name In-place Variant\nHistogram Construction build_histogram \nHistogram Equalization adjust_histogram adjust_histogram!\nHistogram Matching adjust_histogram adjust_histogram!\nGamma Correction adjust_histogram adjust_histogram!\nLinear Stretching adjust_histogram adjust_histogram!\n\n\n\n\n\n"
},

{
    "location": "#ImageContrastAdjustment.adjust_histogram!-Tuple{ContrastStretching,AbstractArray}",
    "page": "ImageContrastAdjustment.jl Documentation",
    "title": "ImageContrastAdjustment.adjust_histogram!",
    "category": "method",
    "text": "adjust_histogram!(ContrastStretching(),img; t = 0.5, slope = 1.0)\n\nSame as adjust_histogram except that it modifies the image that was passed as an argument.\n\n\n\n\n\n"
},

{
    "location": "#Functions-1",
    "page": "ImageContrastAdjustment.jl Documentation",
    "title": "Functions",
    "category": "section",
    "text": "build_histogram\nadjust_histogram(::Equalization, ::AbstractArray, ::Integer; ::Union{Real,AbstractGray}, ::Union{Real,AbstractGray})\nadjust_histogram!(::Equalization, ::AbstractArray, ::Integer; ::Union{Real,AbstractGray}, ::Union{Real,AbstractGray})\nadjust_histogram(::Matching, ::AbstractArray, ::AbstractArray, ::Integer)\nadjust_histogram!(::Matching, ::AbstractArray, ::AbstractArray, ::Integer)\nadjust_histogram(::GammaCorrection, ::AbstractArray, ::Real)\nadjust_histogram!(::GammaCorrection, ::AbstractArray, ::Real)\nadjust_histogram(::LinearStretching, ::AbstractArray; ::Union{Real,AbstractGray}, ::Union{Real,AbstractGray})\nadjust_histogram!(::LinearStretching, ::AbstractArray; ::Union{Real,AbstractGray}, ::Union{Real,AbstractGray})\nadjust_histogram(::ContrastStretching, ::AbstractArray; ::Union{Real,AbstractGray}, ::Union{Real,AbstractGray})\nadjust_histogram!(::ContrastStretching, ::AbstractArray; ::Union{Real,AbstractGray}, ::Union{Real,AbstractGray})"
},

{
    "location": "#Index-1",
    "page": "ImageContrastAdjustment.jl Documentation",
    "title": "Index",
    "category": "section",
    "text": ""
},

]}
