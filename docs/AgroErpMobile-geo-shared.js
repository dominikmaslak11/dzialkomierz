(function (factory) {
  if (typeof define === 'function' && define.amd)
    define(['exports', './kotlin-kotlin-stdlib.js'], factory);
  else if (typeof exports === 'object')
    factory(module.exports, require('./kotlin-kotlin-stdlib.js'));
  else {
    if (typeof globalThis['kotlin-kotlin-stdlib'] === 'undefined') {
      throw new Error("Error loading module 'AgroErpMobile:geo-shared'. Its dependency 'kotlin-kotlin-stdlib' was not found. Please, check whether 'kotlin-kotlin-stdlib' is loaded prior to 'AgroErpMobile:geo-shared'.");
    }
    globalThis['AgroErpMobile:geo-shared'] = factory(typeof globalThis['AgroErpMobile:geo-shared'] === 'undefined' ? {} : globalThis['AgroErpMobile:geo-shared'], globalThis['kotlin-kotlin-stdlib']);
  }
}(function (_, kotlin_kotlin) {
  'use strict';
  //region block: imports
  var imul = Math.imul;
  var hypot = Math.hypot;
  var protoOf = kotlin_kotlin.$_$.w;
  var getStringHashCode = kotlin_kotlin.$_$.q;
  var THROW_CCE = kotlin_kotlin.$_$.e1;
  var initMetadataForClass = kotlin_kotlin.$_$.r;
  var to = kotlin_kotlin.$_$.g1;
  var mapOf = kotlin_kotlin.$_$.l;
  var isCharSequence = kotlin_kotlin.$_$.u;
  var trim = kotlin_kotlin.$_$.d1;
  var toString = kotlin_kotlin.$_$.x;
  var charSequenceLength = kotlin_kotlin.$_$.m;
  var Regex_init_$Create$ = kotlin_kotlin.$_$.c;
  var toIntOrNull = kotlin_kotlin.$_$.c1;
  var _Char___init__impl__6a9atx = kotlin_kotlin.$_$.d;
  var substringBefore = kotlin_kotlin.$_$.b1;
  var equals = kotlin_kotlin.$_$.a1;
  var listOfNotNull = kotlin_kotlin.$_$.j;
  var joinToString = kotlin_kotlin.$_$.i;
  var initMetadataForObject = kotlin_kotlin.$_$.t;
  var emptyList = kotlin_kotlin.$_$.h;
  var collectionSizeOrDefault = kotlin_kotlin.$_$.g;
  var ArrayList_init_$Create$ = kotlin_kotlin.$_$.a;
  var Unit_instance = kotlin_kotlin.$_$.e;
  var isFinite = kotlin_kotlin.$_$.f1;
  var numberToInt = kotlin_kotlin.$_$.v;
  var coerceIn = kotlin_kotlin.$_$.z;
  var ArrayList_init_$Create$_0 = kotlin_kotlin.$_$.b;
  var initMetadataForCompanion = kotlin_kotlin.$_$.s;
  var getNumberHashCode = kotlin_kotlin.$_$.p;
  var equals_0 = kotlin_kotlin.$_$.o;
  var coerceIn_0 = kotlin_kotlin.$_$.y;
  var listOf = kotlin_kotlin.$_$.k;
  var checkIndexOverflow = kotlin_kotlin.$_$.f;
  var defineProp = kotlin_kotlin.$_$.n;
  //endregion
  //region block: pre-declaration
  initMetadataForClass(Stand, 'Stand');
  initMetadataForObject(ForestStand, 'ForestStand');
  initMetadataForObject(GeoArea, 'GeoArea');
  initMetadataForClass(TileKey, 'TileKey');
  initMetadataForObject(TileGrid, 'TileGrid');
  initMetadataForCompanion(Companion);
  initMetadataForClass(MapBounds, 'MapBounds');
  initMetadataForObject(ParcelGeometry, 'ParcelGeometry');
  initMetadataForObject(PolygonIntersection, 'PolygonIntersection');
  initMetadataForObject(PolygonValidity, 'PolygonValidity');
  initMetadataForObject(Puwg1992, 'Puwg1992');
  initMetadataForObject(Geo, 'Geo');
  //endregion
  function Stand(speciesCode, speciesName, ageYears) {
    this.x6_1 = speciesCode;
    this.y6_1 = speciesName;
    this.z6_1 = ageYears;
  }
  protoOf(Stand).a7 = function () {
    var tmp0_elvis_lhs = this.y6_1;
    var tmp;
    if (tmp0_elvis_lhs == null) {
      var tmp1_safe_receiver = this.z6_1;
      var tmp_0;
      if (tmp1_safe_receiver == null) {
        tmp_0 = null;
      } else {
        // Inline function 'kotlin.let' call
        // Inline function 'kotlin.contracts.contract' call
        // Inline function 'com.agroerp.geo.Stand.<get-sentence>.<anonymous>' call
        tmp_0 = 'drzewostan w wieku ok. ' + tmp1_safe_receiver + ' lat';
      }
      return tmp_0;
    } else {
      tmp = tmp0_elvis_lhs;
    }
    var name = tmp;
    var tmp2_elvis_lhs = this.z6_1;
    var tmp_1;
    if (tmp2_elvis_lhs == null) {
      return name;
    } else {
      tmp_1 = tmp2_elvis_lhs;
    }
    var age = tmp_1;
    return name + ', ok. ' + age + ' lat';
  };
  protoOf(Stand).toString = function () {
    return 'Stand(speciesCode=' + this.x6_1 + ', speciesName=' + this.y6_1 + ', ageYears=' + this.z6_1 + ')';
  };
  protoOf(Stand).hashCode = function () {
    var result = this.x6_1 == null ? 0 : getStringHashCode(this.x6_1);
    result = imul(result, 31) + (this.y6_1 == null ? 0 : getStringHashCode(this.y6_1)) | 0;
    result = imul(result, 31) + (this.z6_1 == null ? 0 : this.z6_1) | 0;
    return result;
  };
  protoOf(Stand).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof Stand))
      return false;
    var tmp0_other_with_cast = other instanceof Stand ? other : THROW_CCE();
    if (!(this.x6_1 == tmp0_other_with_cast.x6_1))
      return false;
    if (!(this.y6_1 == tmp0_other_with_cast.y6_1))
      return false;
    if (!(this.z6_1 == tmp0_other_with_cast.z6_1))
      return false;
    return true;
  };
  function ForestStand() {
    ForestStand_instance = this;
    this.b7_1 = mapOf([to('SO', 'sosna'), to('SO.C', 'sosna czarna'), to('SO.WE', 'sosna wejmutka'), to('SO.B', 'sosna Banksa'), to('\u015AW', '\u015Bwierk'), to('SW', '\u015Bwierk'), to('JD', 'jod\u0142a'), to('MD', 'modrzew'), to('DG', 'daglezja'), to('BK', 'buk'), to('DB', 'd\u0105b'), to('DB.S', 'd\u0105b szypu\u0142kowy'), to('DB.B', 'd\u0105b bezszypu\u0142kowy'), to('DB.C', 'd\u0105b czerwony'), to('GB', 'grab'), to('BRZ', 'brzoza'), to('OL', 'olsza'), to('OL.S', 'olsza szara'), to('JS', 'jesion'), to('KL', 'klon'), to('JW', 'jawor'), to('LP', 'lipa'), to('WZ', 'wi\u0105z'), to('TP', 'topola'), to('OS', 'osika'), to('WB', 'wierzba'), to('AK', 'robinia akacjowa'), to('CZM', 'czeremcha'), to('JRZ', 'jarz\u0105b'), to('CZR', 'czere\u015Bnia'), to('GR', 'grusza'), to('JB', 'jab\u0142o\u0144')]);
    this.c7_1 = mapOf([to('BS', 'b\xF3r suchy'), to('B', 'b\xF3r'), to('BM', 'b\xF3r mieszany'), to('LM', 'las mieszany'), to('L', 'las'), to('L\u0141', 'las \u0142\u0119gowy'), to('LL', 'las \u0142\u0119gowy'), to('OL', 'ols'), to('OLJ', 'ols jesionowy')]);
    this.d7_1 = mapOf([to('\u015B', '\u015Bwie\u017Cy'), to('\u015Bw', '\u015Bwie\u017Cy'), to('w', 'wilgotny'), to('b', 'bagienny'), to('s', 'suchy')]);
  }
  protoOf(ForestStand).e7 = function (label) {
    var tmp;
    if (label == null) {
      tmp = null;
    } else {
      // Inline function 'kotlin.text.trim' call
      tmp = toString(trim(isCharSequence(label) ? label : THROW_CCE()));
    }
    var tmp1_safe_receiver = tmp;
    var tmp_0;
    if (tmp1_safe_receiver == null) {
      tmp_0 = null;
    } else {
      // Inline function 'kotlin.text.uppercase' call
      // Inline function 'kotlin.js.asDynamic' call
      tmp_0 = tmp1_safe_receiver.toUpperCase();
    }
    var tmp2_elvis_lhs = tmp_0;
    var tmp_1;
    if (tmp2_elvis_lhs == null) {
      return null;
    } else {
      tmp_1 = tmp2_elvis_lhs;
    }
    var text = tmp_1;
    // Inline function 'kotlin.text.isEmpty' call
    if (charSequenceLength(text) === 0)
      return null;
    var tmp3_elvis_lhs = Regex_init_$Create$('^([A-Z\u015A\u017B\u0106\u0141\xD3\u0143]+(?:\\.[A-Z\u015A\u017B\u0106\u0141\xD3\u0143]+)?)\\s*(\\d+)?$').d5(text);
    var tmp_2;
    if (tmp3_elvis_lhs == null) {
      return null;
    } else {
      tmp_2 = tmp3_elvis_lhs;
    }
    var match = tmp_2;
    var code = match.s5().j(1);
    var age = toIntOrNull(match.s5().j(2));
    var tmp4_elvis_lhs = this.b7_1.r(code);
    var tmp_3;
    if (tmp4_elvis_lhs == null) {
      // Inline function 'kotlin.let' call
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'com.agroerp.geo.ForestStand.parse.<anonymous>' call
      var it = substringBefore(code, _Char___init__impl__6a9atx(46));
      tmp_3 = ForestStand_getInstance().b7_1.r(it);
    } else {
      tmp_3 = tmp4_elvis_lhs;
    }
    var tmp5_elvis_lhs = tmp_3;
    var tmp_4;
    if (tmp5_elvis_lhs == null) {
      return !(age == null) ? new Stand(code, null, age) : null;
    } else {
      tmp_4 = tmp5_elvis_lhs;
    }
    var name = tmp_4;
    return new Stand(code, name, age);
  };
  protoOf(ForestStand).f7 = function (code) {
    var tmp;
    if (code == null) {
      tmp = null;
    } else {
      // Inline function 'kotlin.text.trim' call
      tmp = toString(trim(isCharSequence(code) ? code : THROW_CCE()));
    }
    var tmp1_elvis_lhs = tmp;
    var tmp_0;
    if (tmp1_elvis_lhs == null) {
      return null;
    } else {
      tmp_0 = tmp1_elvis_lhs;
    }
    var text = tmp_0;
    var tmp_1;
    // Inline function 'kotlin.text.isEmpty' call
    if (charSequenceLength(text) === 0) {
      tmp_1 = true;
    } else {
      tmp_1 = equals(text, 'Null', true);
    }
    if (tmp_1)
      return null;
    var tmp2_elvis_lhs = Regex_init_$Create$('^([A-Z\u0141]+)([a-z\u015Bw]*)$').d5(text);
    var tmp_2;
    if (tmp2_elvis_lhs == null) {
      return null;
    } else {
      tmp_2 = tmp2_elvis_lhs;
    }
    var match = tmp_2;
    var tmp3_elvis_lhs = this.c7_1.r(match.s5().j(1));
    var tmp_3;
    if (tmp3_elvis_lhs == null) {
      return null;
    } else {
      tmp_3 = tmp3_elvis_lhs;
    }
    var kind = tmp_3;
    var moisture = this.d7_1.r(match.s5().j(2));
    return joinToString(listOfNotNull([kind, moisture]), ' ') + (' (' + text + ')');
  };
  protoOf(ForestStand).g7 = function (address) {
    var tmp;
    if (address == null) {
      tmp = null;
    } else {
      // Inline function 'kotlin.text.trim' call
      tmp = toString(trim(isCharSequence(address) ? address : THROW_CCE()));
    }
    var tmp1_elvis_lhs = tmp;
    var tmp_0;
    if (tmp1_elvis_lhs == null) {
      return null;
    } else {
      tmp_0 = tmp1_elvis_lhs;
    }
    var text = tmp_0;
    var tmp2_elvis_lhs = Regex_init_$Create$('-\\s*([a-z])\\s*-').d5(text);
    var tmp_1;
    if (tmp2_elvis_lhs == null) {
      return null;
    } else {
      tmp_1 = tmp2_elvis_lhs;
    }
    var match = tmp_1;
    return match.s5().j(1);
  };
  protoOf(ForestStand).h7 = function (standLabel, habitatCode, forestAddress) {
    var tmp0_safe_receiver = this.g7(forestAddress);
    var tmp;
    if (tmp0_safe_receiver == null) {
      tmp = null;
    } else {
      // Inline function 'kotlin.let' call
      // Inline function 'kotlin.contracts.contract' call
      // Inline function 'com.agroerp.geo.ForestStand.describe.<anonymous>' call
      tmp = 'wydzielenie ' + tmp0_safe_receiver;
    }
    var tmp_0 = tmp;
    var tmp1_safe_receiver = this.e7(standLabel);
    var parts = listOfNotNull([tmp_0, tmp1_safe_receiver == null ? null : tmp1_safe_receiver.a7(), this.f7(habitatCode)]);
    // Inline function 'kotlin.takeIf' call
    // Inline function 'kotlin.contracts.contract' call
    var tmp_1;
    // Inline function 'com.agroerp.geo.ForestStand.describe.<anonymous>' call
    // Inline function 'kotlin.collections.isNotEmpty' call
    if (!parts.l()) {
      tmp_1 = parts;
    } else {
      tmp_1 = null;
    }
    var tmp2_safe_receiver = tmp_1;
    return tmp2_safe_receiver == null ? null : joinToString(tmp2_safe_receiver, ', ');
  };
  var ForestStand_instance;
  function ForestStand_getInstance() {
    if (ForestStand_instance == null)
      new ForestStand();
    return ForestStand_instance;
  }
  function GeoArea() {
    this.i7_1 = 111320.0;
  }
  protoOf(GeoArea).j7 = function (points) {
    if (points.i() < 3)
      return 0.0;
    var sum = 0.0;
    var inductionVariable = 0;
    var last = points.i() - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var _destruct__k2r9zo = points.j(i);
        var x1 = _destruct__k2r9zo.a6();
        var y1 = _destruct__k2r9zo.b6();
        var _destruct__k2r9zo_0 = points.j((i + 1 | 0) % points.i() | 0);
        var x2 = _destruct__k2r9zo_0.a6();
        var y2 = _destruct__k2r9zo_0.b6();
        sum = sum + (x1 * y2 - x2 * y1);
      }
       while (inductionVariable <= last);
    // Inline function 'kotlin.math.abs' call
    var x = sum;
    return Math.abs(x) / 2.0;
  };
  protoOf(GeoArea).k7 = function (points) {
    if (points.l())
      return emptyList();
    var lat0 = points.j(0).y5_1;
    var lon0 = points.j(0).z5_1;
    // Inline function 'kotlin.math.cos' call
    var x = lat0 * 3.141592653589793 / 180.0;
    var metresPerDegreeLon = 111320.0 * Math.cos(x);
    // Inline function 'kotlin.collections.map' call
    // Inline function 'kotlin.collections.mapTo' call
    var destination = ArrayList_init_$Create$(collectionSizeOrDefault(points, 10));
    var tmp0_iterator = points.f();
    while (tmp0_iterator.g()) {
      var item = tmp0_iterator.h();
      // Inline function 'com.agroerp.geo.GeoArea.projectToLocalMetres.<anonymous>' call
      var lat = item.a6();
      var lon = item.b6();
      var tmp$ret$1 = to((lon - lon0) * metresPerDegreeLon, (lat - lat0) * 111320.0);
      destination.d(tmp$ret$1);
    }
    return destination;
  };
  protoOf(GeoArea).l7 = function (points) {
    if (points.i() < 3)
      return 0.0;
    return this.j7(this.k7(points));
  };
  protoOf(GeoArea).m7 = function (points) {
    if (points.i() < 2)
      return 0.0;
    var total = 0.0;
    var inductionVariable = 0;
    var last = points.i() - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var _destruct__k2r9zo = points.j(i);
        var x1 = _destruct__k2r9zo.a6();
        var y1 = _destruct__k2r9zo.b6();
        var _destruct__k2r9zo_0 = points.j((i + 1 | 0) % points.i() | 0);
        var x2 = _destruct__k2r9zo_0.a6();
        var y2 = _destruct__k2r9zo_0.b6();
        var tmp = total;
        // Inline function 'kotlin.math.hypot' call
        var x = x2 - x1;
        var y = y2 - y1;
        total = tmp + hypot(x, y);
      }
       while (inductionVariable <= last);
    return total;
  };
  protoOf(GeoArea).n7 = function (points) {
    if (points.i() < 2)
      return 0.0;
    return this.m7(this.k7(points));
  };
  var GeoArea_instance;
  function GeoArea_getInstance() {
    return GeoArea_instance;
  }
  function TileKey(z, x, y) {
    this.o7_1 = z;
    this.p7_1 = x;
    this.q7_1 = y;
  }
  protoOf(TileKey).r7 = function () {
    var span = TileGrid_instance.x7(this.o7_1);
    return new MapBounds(this.p7_1 * span, this.q7_1 * span, (this.p7_1 + 1 | 0) * span, (this.q7_1 + 1 | 0) * span);
  };
  protoOf(TileKey).toString = function () {
    return 'TileKey(z=' + this.o7_1 + ', x=' + this.p7_1 + ', y=' + this.q7_1 + ')';
  };
  protoOf(TileKey).hashCode = function () {
    var result = this.o7_1;
    result = imul(result, 31) + this.p7_1 | 0;
    result = imul(result, 31) + this.q7_1 | 0;
    return result;
  };
  protoOf(TileKey).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof TileKey))
      return false;
    var tmp0_other_with_cast = other instanceof TileKey ? other : THROW_CCE();
    if (!(this.o7_1 === tmp0_other_with_cast.o7_1))
      return false;
    if (!(this.p7_1 === tmp0_other_with_cast.p7_1))
      return false;
    if (!(this.q7_1 === tmp0_other_with_cast.q7_1))
      return false;
    return true;
  };
  function TileGrid() {
    this.s7_1 = 1024;
    this.t7_1 = 64.0;
    this.u7_1 = 0;
    this.v7_1 = 10;
    this.w7_1 = 12;
  }
  protoOf(TileGrid).y7 = function (z) {
    // Inline function 'kotlin.math.pow' call
    return 64.0 / Math.pow(2.0, z);
  };
  protoOf(TileGrid).x7 = function (z) {
    return 1024 * this.y7(z);
  };
  protoOf(TileGrid).z7 = function (metresPerPixel) {
    if (metresPerPixel <= 0 || !isFinite(metresPerPixel))
      return 10;
    // Inline function 'kotlin.math.ln' call
    var x = 64.0 / metresPerPixel;
    var tmp = Math.log(x);
    // Inline function 'kotlin.math.ln' call
    var exact = tmp / Math.log(2.0);
    // Inline function 'kotlin.math.ceil' call
    var tmp$ret$2 = Math.ceil(exact);
    return coerceIn(numberToInt(tmp$ret$2), 0, 10);
  };
  protoOf(TileGrid).a8 = function (bounds, z) {
    var span = this.x7(z);
    // Inline function 'kotlin.math.floor' call
    var x = bounds.b8_1 / span;
    var tmp$ret$0 = Math.floor(x);
    var minX = numberToInt(tmp$ret$0);
    // Inline function 'kotlin.math.floor' call
    var x_0 = bounds.c8_1 / span;
    var tmp$ret$1 = Math.floor(x_0);
    var minY = numberToInt(tmp$ret$1);
    // Inline function 'kotlin.math.floor' call
    var x_1 = (bounds.d8_1 - 1.0E-9) / span;
    var tmp$ret$2 = Math.floor(x_1);
    var maxX = numberToInt(tmp$ret$2);
    // Inline function 'kotlin.math.floor' call
    var x_2 = (bounds.e8_1 - 1.0E-9) / span;
    var tmp$ret$3 = Math.floor(x_2);
    var maxY = numberToInt(tmp$ret$3);
    // Inline function 'kotlin.collections.buildList' call
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'kotlin.collections.buildListInternal' call
    // Inline function 'kotlin.apply' call
    var this_0 = ArrayList_init_$Create$_0();
    // Inline function 'kotlin.contracts.contract' call
    // Inline function 'com.agroerp.geo.TileGrid.cover.<anonymous>' call
    var inductionVariable = minY;
    if (inductionVariable <= maxY)
      do {
        var y = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var inductionVariable_0 = minX;
        if (inductionVariable_0 <= maxX)
          do {
            var x_3 = inductionVariable_0;
            inductionVariable_0 = inductionVariable_0 + 1 | 0;
            this_0.d(new TileKey(z, x_3, y));
          }
           while (!(x_3 === maxX));
      }
       while (!(y === maxY));
    return this_0.n2();
  };
  protoOf(TileGrid).f8 = function (bounds, metresPerPixel) {
    var z = this.z7(metresPerPixel);
    while (z > 0 && this.a8(bounds, z).i() > 12) {
      z = z - 1 | 0;
    }
    return z;
  };
  var TileGrid_instance;
  function TileGrid_getInstance() {
    return TileGrid_instance;
  }
  function Companion() {
    this.g8_1 = 20.0;
    this.h8_1 = 20000.0;
  }
  var Companion_instance;
  function Companion_getInstance() {
    return Companion_instance;
  }
  function MapBounds(minEasting, minNorthing, maxEasting, maxNorthing) {
    this.b8_1 = minEasting;
    this.c8_1 = minNorthing;
    this.d8_1 = maxEasting;
    this.e8_1 = maxNorthing;
  }
  protoOf(MapBounds).toString = function () {
    return 'MapBounds(minEasting=' + this.b8_1 + ', minNorthing=' + this.c8_1 + ', maxEasting=' + this.d8_1 + ', maxNorthing=' + this.e8_1 + ')';
  };
  protoOf(MapBounds).hashCode = function () {
    var result = getNumberHashCode(this.b8_1);
    result = imul(result, 31) + getNumberHashCode(this.c8_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.d8_1) | 0;
    result = imul(result, 31) + getNumberHashCode(this.e8_1) | 0;
    return result;
  };
  protoOf(MapBounds).equals = function (other) {
    if (this === other)
      return true;
    if (!(other instanceof MapBounds))
      return false;
    var tmp0_other_with_cast = other instanceof MapBounds ? other : THROW_CCE();
    if (!equals_0(this.b8_1, tmp0_other_with_cast.b8_1))
      return false;
    if (!equals_0(this.c8_1, tmp0_other_with_cast.c8_1))
      return false;
    if (!equals_0(this.d8_1, tmp0_other_with_cast.d8_1))
      return false;
    if (!equals_0(this.e8_1, tmp0_other_with_cast.e8_1))
      return false;
    return true;
  };
  function ParcelGeometry() {
  }
  protoOf(ParcelGeometry).i8 = function (point, polygon) {
    if (polygon.i() < 3)
      return false;
    var x = point.a6();
    var y = point.b6();
    var inside = false;
    var inductionVariable = 0;
    var last = polygon.i() - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var _destruct__k2r9zo = polygon.j(i);
        var x1 = _destruct__k2r9zo.a6();
        var y1 = _destruct__k2r9zo.b6();
        var _destruct__k2r9zo_0 = polygon.j((i + 1 | 0) % polygon.i() | 0);
        var x2 = _destruct__k2r9zo_0.a6();
        var y2 = _destruct__k2r9zo_0.b6();
        if (!(y1 > y === y2 > y) && x < (x2 - x1) * (y - y1) / (y2 - y1) + x1) {
          inside = !inside;
        }
      }
       while (inductionVariable <= last);
    return inside;
  };
  protoOf(ParcelGeometry).j8 = function (point, polygon) {
    if (polygon.i() < 2)
      return null;
    var x = point.a6();
    var y = point.b6();
    var best = 1.7976931348623157E308;
    var inductionVariable = 0;
    var last = polygon.i() - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var _destruct__k2r9zo = polygon.j(i);
        var x1 = _destruct__k2r9zo.a6();
        var y1 = _destruct__k2r9zo.b6();
        var _destruct__k2r9zo_0 = polygon.j((i + 1 | 0) % polygon.i() | 0);
        var x2 = _destruct__k2r9zo_0.a6();
        var y2 = _destruct__k2r9zo_0.b6();
        var dx = x2 - x1;
        var dy = y2 - y1;
        var lengthSquared = dx * dx + dy * dy;
        var t = lengthSquared === 0.0 ? 0.0 : coerceIn_0(((x - x1) * dx + (y - y1) * dy) / lengthSquared, 0.0, 1.0);
        // Inline function 'kotlin.comparisons.minOf' call
        var a = best;
        // Inline function 'kotlin.math.hypot' call
        var x_0 = x - (x1 + t * dx);
        var y_0 = y - (y1 + t * dy);
        var b = hypot(x_0, y_0);
        best = Math.min(a, b);
      }
       while (inductionVariable <= last);
    return best;
  };
  var ParcelGeometry_instance;
  function ParcelGeometry_getInstance() {
    return ParcelGeometry_instance;
  }
  function shift(_this__u8e3s4, $this, ox, oy) {
    return to(_this__u8e3s4.y5_1 - ox, _this__u8e3s4.z5_1 - oy);
  }
  function cross($this, p, q) {
    return p.y5_1 * q.z5_1 - q.y5_1 * p.z5_1;
  }
  function sign($this, v) {
    return v > 0 ? 1.0 : -1.0;
  }
  function triangleOverlap($this, a1, a2, b1, b2) {
    var origin = to(0.0, 0.0);
    var polygon = listOf([origin, a1, a2]);
    var clip = cross($this, b1, b2) > 0 ? listOf([origin, b1, b2]) : listOf([origin, b2, b1]);
    var inductionVariable = 0;
    var last = clip.i() - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        polygon = clipHalfPlane($this, polygon, clip.j(i), clip.j((i + 1 | 0) % clip.i() | 0));
        if (polygon.i() < 3)
          return 0.0;
      }
       while (inductionVariable <= last);
    return GeoArea_instance.j7(polygon);
  }
  function clipHalfPlane($this, polygon, from, to_0) {
    if (polygon.l())
      return polygon;
    var dx = to_0.y5_1 - from.y5_1;
    var dy = to_0.z5_1 - from.z5_1;
    // Inline function 'kotlin.collections.mutableListOf' call
    var result = ArrayList_init_$Create$_0();
    var inductionVariable = 0;
    var last = polygon.i() - 1 | 0;
    if (inductionVariable <= last)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var current = polygon.j(i);
        var next = polygon.j((i + 1 | 0) % polygon.i() | 0);
        var sideCurrent = clipHalfPlane$side(dx, from, dy, current);
        var sideNext = clipHalfPlane$side(dx, from, dy, next);
        if (sideCurrent >= 0) {
          result.d(current);
        }
        if (sideCurrent > 0 && sideNext < 0 || (sideCurrent < 0 && sideNext > 0)) {
          var t = sideCurrent / (sideCurrent - sideNext);
          result.d(to(current.y5_1 + (next.y5_1 - current.y5_1) * t, current.z5_1 + (next.z5_1 - current.z5_1) * t));
        }
      }
       while (inductionVariable <= last);
    return result;
  }
  function clipHalfPlane$side(dx, $from, dy, p) {
    return dx * (p.z5_1 - $from.z5_1) - dy * (p.y5_1 - $from.y5_1);
  }
  function PolygonIntersection() {
  }
  protoOf(PolygonIntersection).k8 = function (a, b) {
    if (a.i() < 3 || b.i() < 3)
      return 0.0;
    var ox = a.j(0).y5_1;
    var oy = a.j(0).z5_1;
    var total = 0.0;
    var inductionVariable = 0;
    var last = a.i() - 1 | 0;
    if (inductionVariable <= last)
      $l$loop: do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var a1 = shift(a.j(i), this, ox, oy);
        var a2 = shift(a.j((i + 1 | 0) % a.i() | 0), this, ox, oy);
        var signA = cross(this, a1, a2);
        if (signA === 0.0)
          continue $l$loop;
        var inductionVariable_0 = 0;
        var last_0 = b.i() - 1 | 0;
        if (inductionVariable_0 <= last_0)
          $l$loop_0: do {
            var j = inductionVariable_0;
            inductionVariable_0 = inductionVariable_0 + 1 | 0;
            var b1 = shift(b.j(j), this, ox, oy);
            var b2 = shift(b.j((j + 1 | 0) % b.i() | 0), this, ox, oy);
            var signB = cross(this, b1, b2);
            if (signB === 0.0)
              continue $l$loop_0;
            var overlap = triangleOverlap(this, a1, a2, b1, b2);
            if (!(overlap === 0.0)) {
              total = total + overlap * sign(this, signA) * sign(this, signB);
            }
          }
           while (inductionVariable_0 <= last_0);
      }
       while (inductionVariable <= last);
    // Inline function 'kotlin.math.abs' call
    var x = total;
    return Math.abs(x);
  };
  protoOf(PolygonIntersection).l8 = function (part, whole) {
    var own = GeoArea_instance.j7(part);
    if (own <= 0.0)
      return 0.0;
    return coerceIn_0(this.k8(part, whole) / own, 0.0, 1.0);
  };
  var PolygonIntersection_instance;
  function PolygonIntersection_getInstance() {
    return PolygonIntersection_instance;
  }
  function segmentsCross($this, a1, a2, b1, b2) {
    var d1 = orientation($this, b1, b2, a1);
    var d2 = orientation($this, b1, b2, a2);
    var d3 = orientation($this, a1, a2, b1);
    var d4 = orientation($this, a1, a2, b2);
    return (d1 > 0 && d2 < 0 || (d1 < 0 && d2 > 0)) && (d3 > 0 && d4 < 0 || (d3 < 0 && d4 > 0));
  }
  function orientation($this, p, q, r) {
    return (q.y5_1 - p.y5_1) * (r.z5_1 - p.z5_1) - (q.z5_1 - p.z5_1) * (r.y5_1 - p.y5_1);
  }
  function PolygonValidity() {
  }
  protoOf(PolygonValidity).m8 = function (points) {
    var n = points.i();
    if (n < 4)
      return false;
    var inductionVariable = 0;
    if (inductionVariable < n)
      do {
        var i = inductionVariable;
        inductionVariable = inductionVariable + 1 | 0;
        var a1 = points.j(i);
        var a2 = points.j((i + 1 | 0) % n | 0);
        var inductionVariable_0 = i + 1 | 0;
        if (inductionVariable_0 < n)
          $l$loop_0: do {
            var j = inductionVariable_0;
            inductionVariable_0 = inductionVariable_0 + 1 | 0;
            if (j === i)
              continue $l$loop_0;
            if (((j + 1 | 0) % n | 0) === i || ((i + 1 | 0) % n | 0) === j)
              continue $l$loop_0;
            var b1 = points.j(j);
            var b2 = points.j((j + 1 | 0) % n | 0);
            if (segmentsCross(this, a1, a2, b1, b2))
              return true;
          }
           while (inductionVariable_0 < n);
      }
       while (inductionVariable < n);
    return false;
  };
  var PolygonValidity_instance;
  function PolygonValidity_getInstance() {
    return PolygonValidity_instance;
  }
  function Puwg1992() {
    Puwg1992_instance = this;
    this.n8_1 = 6378137.0;
    this.o8_1 = 0.003352810681182319;
    this.p8_1 = 0.003352810681182319 * (2 - 0.003352810681182319);
    this.q8_1 = this.p8_1 / (1 - this.p8_1);
    this.r8_1 = 19.0;
    this.s8_1 = 0.9993;
    this.t8_1 = 500000.0;
    this.u8_1 = -5300000.0;
  }
  protoOf(Puwg1992).v8 = function (latDeg, lonDeg) {
    var lat = latDeg * 3.141592653589793 / 180.0;
    var dLon = (lonDeg - 19.0) * 3.141592653589793 / 180.0;
    // Inline function 'kotlin.math.sin' call
    var sinLat = Math.sin(lat);
    // Inline function 'kotlin.math.cos' call
    var cosLat = Math.cos(lat);
    // Inline function 'kotlin.math.tan' call
    var tanLat = Math.tan(lat);
    // Inline function 'kotlin.math.sqrt' call
    var x = 1 - this.p8_1 * sinLat * sinLat;
    var n = 6378137.0 / Math.sqrt(x);
    var t = tanLat * tanLat;
    var c = this.q8_1 * cosLat * cosLat;
    var a1 = dLon * cosLat;
    var tmp = (1 - this.p8_1 / 4 - 3 * this.p8_1 * this.p8_1 / 64 - 5 * this.p8_1 * this.p8_1 * this.p8_1 / 256) * lat;
    var tmp_0 = 3 * this.p8_1 / 8 + 3 * this.p8_1 * this.p8_1 / 32 + 45 * this.p8_1 * this.p8_1 * this.p8_1 / 1024;
    // Inline function 'kotlin.math.sin' call
    var x_0 = 2 * lat;
    var tmp_1 = tmp - tmp_0 * Math.sin(x_0);
    var tmp_2 = 15 * this.p8_1 * this.p8_1 / 256 + 45 * this.p8_1 * this.p8_1 * this.p8_1 / 1024;
    // Inline function 'kotlin.math.sin' call
    var x_1 = 4 * lat;
    var tmp_3 = tmp_1 + tmp_2 * Math.sin(x_1);
    var tmp_4 = 35 * this.p8_1 * this.p8_1 * this.p8_1 / 3072;
    // Inline function 'kotlin.math.sin' call
    var x_2 = 6 * lat;
    var m = 6378137.0 * (tmp_3 - tmp_4 * Math.sin(x_2));
    var a3 = a1 * a1 * a1;
    var a5 = a3 * a1 * a1;
    var easting = 500000.0 + 0.9993 * n * (a1 + (1 - t + c) * a3 / 6 + (5 - 18 * t + t * t + 72 * c - 58 * this.q8_1) * a5 / 120);
    var a2 = a1 * a1;
    var a4 = a2 * a2;
    var a6 = a4 * a2;
    var northing = -5300000.0 + 0.9993 * (m + n * tanLat * (a2 / 2 + (5 - t + 9 * c + 4 * c * c) * a4 / 24 + (61 - 58 * t + t * t + 600 * c - 330 * this.q8_1) * a6 / 720));
    return to(easting, northing);
  };
  protoOf(Puwg1992).w8 = function (easting, northing) {
    var m = (northing - -5300000.0) / 0.9993;
    // Inline function 'kotlin.math.sqrt' call
    var x = 1 - this.p8_1;
    var tmp = 1 - Math.sqrt(x);
    // Inline function 'kotlin.math.sqrt' call
    var x_0 = 1 - this.p8_1;
    var e1 = tmp / (1 + Math.sqrt(x_0));
    var mu = m / (6378137.0 * (1 - this.p8_1 / 4 - 3 * this.p8_1 * this.p8_1 / 64 - 5 * this.p8_1 * this.p8_1 * this.p8_1 / 256));
    var tmp_0 = 3 * e1 / 2 - 27 * e1 * e1 * e1 / 32;
    // Inline function 'kotlin.math.sin' call
    var x_1 = 2 * mu;
    var tmp_1 = mu + tmp_0 * Math.sin(x_1);
    var tmp_2 = 21 * e1 * e1 / 16 - 55 * e1 * e1 * e1 * e1 / 32;
    // Inline function 'kotlin.math.sin' call
    var x_2 = 4 * mu;
    var tmp_3 = tmp_1 + tmp_2 * Math.sin(x_2);
    var tmp_4 = 151 * e1 * e1 * e1 / 96;
    // Inline function 'kotlin.math.sin' call
    var x_3 = 6 * mu;
    var tmp_5 = tmp_3 + tmp_4 * Math.sin(x_3);
    var tmp_6 = 1097 * e1 * e1 * e1 * e1 / 512;
    // Inline function 'kotlin.math.sin' call
    var x_4 = 8 * mu;
    var phi1 = tmp_5 + tmp_6 * Math.sin(x_4);
    // Inline function 'kotlin.math.sin' call
    var sinPhi1 = Math.sin(phi1);
    // Inline function 'kotlin.math.cos' call
    var cosPhi1 = Math.cos(phi1);
    // Inline function 'kotlin.math.tan' call
    var tanPhi1 = Math.tan(phi1);
    var c1 = this.q8_1 * cosPhi1 * cosPhi1;
    var t1 = tanPhi1 * tanPhi1;
    // Inline function 'kotlin.math.sqrt' call
    var x_5 = 1 - this.p8_1 * sinPhi1 * sinPhi1;
    var n1 = 6378137.0 / Math.sqrt(x_5);
    var tmp_7 = 6378137.0 * (1 - this.p8_1);
    // Inline function 'kotlin.math.pow' call
    var this_0 = 1 - this.p8_1 * sinPhi1 * sinPhi1;
    var r1 = tmp_7 / Math.pow(this_0, 1.5);
    var d = (easting - 500000.0) / (n1 * 0.9993);
    var d2 = d * d;
    var d4 = d2 * d2;
    var d6 = d4 * d2;
    var lat = phi1 - n1 * tanPhi1 / r1 * (d2 / 2 - (5 + 3 * t1 + 10 * c1 - 4 * c1 * c1 - 9 * this.q8_1) * d4 / 24 + (61 + 90 * t1 + 298 * c1 + 45 * t1 * t1 - 252 * this.q8_1 - 3 * c1 * c1) * d6 / 720);
    var lon = 19.0 * 3.141592653589793 / 180.0 + (d - (1 + 2 * t1 + c1) * d * d2 / 6 + (5 - 2 * c1 + 28 * t1 - 3 * c1 * c1 + 8 * this.q8_1 + 24 * t1 * t1) * d * d4 / 120) / cosPhi1;
    return to(lat * 180.0 / 3.141592653589793, lon * 180.0 / 3.141592653589793);
  };
  var Puwg1992_instance;
  function Puwg1992_getInstance() {
    if (Puwg1992_instance == null)
      new Puwg1992();
    return Puwg1992_instance;
  }
  function doPar(_this__u8e3s4, $this) {
    var wynik = ArrayList_init_$Create$(_this__u8e3s4.length / 2 | 0);
    var i = 0;
    while ((i + 1 | 0) < _this__u8e3s4.length) {
      wynik.d(to(_this__u8e3s4[i], _this__u8e3s4[i + 1 | 0]));
      i = i + 2 | 0;
    }
    return wynik;
  }
  function doTablicy(_this__u8e3s4, $this) {
    var wynik = new Float64Array(imul(_this__u8e3s4.i(), 2));
    // Inline function 'kotlin.collections.forEachIndexed' call
    var index = 0;
    var tmp0_iterator = _this__u8e3s4.f();
    while (tmp0_iterator.g()) {
      var item = tmp0_iterator.h();
      // Inline function 'com.agroerp.geo.Geo.doTablicy.<anonymous>' call
      var tmp1 = index;
      index = tmp1 + 1 | 0;
      var i = checkIndexOverflow(tmp1);
      var x = item.a6();
      var y = item.b6();
      wynik[imul(i, 2)] = x;
      wynik[imul(i, 2) + 1 | 0] = y;
    }
    return wynik;
  }
  function Geo() {
  }
  protoOf(Geo).toEastingNorthing = function (lat, lon) {
    var _destruct__k2r9zo = Puwg1992_getInstance().v8(lat, lon);
    var e = _destruct__k2r9zo.a6();
    var n = _destruct__k2r9zo.b6();
    // Inline function 'kotlin.doubleArrayOf' call
    return new Float64Array([e, n]);
  };
  protoOf(Geo).toLatLon = function (easting, northing) {
    var _destruct__k2r9zo = Puwg1992_getInstance().w8(easting, northing);
    var lat = _destruct__k2r9zo.a6();
    var lon = _destruct__k2r9zo.b6();
    // Inline function 'kotlin.doubleArrayOf' call
    return new Float64Array([lat, lon]);
  };
  protoOf(Geo).areaM2 = function (flatXY) {
    return GeoArea_instance.j7(doPar(flatXY, this));
  };
  protoOf(Geo).areaFromLatLonM2 = function (flatLatLon) {
    return GeoArea_instance.l7(doPar(flatLatLon, this));
  };
  protoOf(Geo).perimeterM = function (flatXY) {
    return GeoArea_instance.m7(doPar(flatXY, this));
  };
  protoOf(Geo).perimeterFromLatLonM = function (flatLatLon) {
    return GeoArea_instance.n7(doPar(flatLatLon, this));
  };
  protoOf(Geo).projectToMetres = function (flatLatLon) {
    return doTablicy(GeoArea_instance.k7(doPar(flatLatLon, this)), this);
  };
  protoOf(Geo).selfIntersects = function (flatXY) {
    return PolygonValidity_instance.m8(doPar(flatXY, this));
  };
  protoOf(Geo).contains = function (x, y, flatPolygonXY) {
    return ParcelGeometry_instance.i8(to(x, y), doPar(flatPolygonXY, this));
  };
  protoOf(Geo).distanceToBoundaryM = function (x, y, flatPolygonXY) {
    var tmp0_elvis_lhs = ParcelGeometry_instance.j8(to(x, y), doPar(flatPolygonXY, this));
    return tmp0_elvis_lhs == null ? -1.0 : tmp0_elvis_lhs;
  };
  protoOf(Geo).intersectionAreaM2 = function (flatA, flatB) {
    return PolygonIntersection_instance.k8(doPar(flatA, this), doPar(flatB, this));
  };
  protoOf(Geo).fractionInside = function (flatPart, flatWhole) {
    return PolygonIntersection_instance.l8(doPar(flatPart, this), doPar(flatWhole, this));
  };
  protoOf(Geo).poziomKafli = function (minE, minN, maxE, maxN, metrowNaPiksel) {
    return TileGrid_instance.f8(new MapBounds(minE, minN, maxE, maxN), metrowNaPiksel);
  };
  protoOf(Geo).rozmiarKafla = function (poziom) {
    return TileGrid_instance.x7(poziom);
  };
  protoOf(Geo).pikseliKafla = function () {
    return 1024;
  };
  protoOf(Geo).kafleDlaWidoku = function (minE, minN, maxE, maxN, poziom) {
    var kafle = TileGrid_instance.a8(new MapBounds(minE, minN, maxE, maxN), poziom);
    var wynik = new Int32Array(imul(kafle.i(), 3));
    // Inline function 'kotlin.collections.forEachIndexed' call
    var index = 0;
    var tmp0_iterator = kafle.f();
    while (tmp0_iterator.g()) {
      var item = tmp0_iterator.h();
      // Inline function 'com.agroerp.geo.Geo.kafleDlaWidoku.<anonymous>' call
      var tmp1 = index;
      index = tmp1 + 1 | 0;
      var i = checkIndexOverflow(tmp1);
      wynik[imul(i, 3)] = item.o7_1;
      wynik[imul(i, 3) + 1 | 0] = item.p7_1;
      wynik[imul(i, 3) + 2 | 0] = item.q7_1;
    }
    return wynik;
  };
  protoOf(Geo).zasiegKafla = function (z, x, y) {
    var b = (new TileKey(z, x, y)).r7();
    // Inline function 'kotlin.doubleArrayOf' call
    return new Float64Array([b.b8_1, b.c8_1, b.d8_1, b.e8_1]);
  };
  protoOf(Geo).opisDrzewostanu = function (kod) {
    var tmp0_safe_receiver = ForestStand_getInstance().e7(kod);
    return tmp0_safe_receiver == null ? null : tmp0_safe_receiver.a7();
  };
  protoOf(Geo).opisSiedliska = function (kod) {
    return ForestStand_getInstance().f7(kod);
  };
  protoOf(Geo).opisLasu = function (etykietaDrzewostanu, kodSiedliska, adresLesny) {
    return ForestStand_getInstance().h7(etykietaDrzewostanu, kodSiedliska, adresLesny);
  };
  var Geo_instance;
  function Geo_getInstance() {
    return Geo_instance;
  }
  //region block: init
  GeoArea_instance = new GeoArea();
  TileGrid_instance = new TileGrid();
  Companion_instance = new Companion();
  ParcelGeometry_instance = new ParcelGeometry();
  PolygonIntersection_instance = new PolygonIntersection();
  PolygonValidity_instance = new PolygonValidity();
  Geo_instance = new Geo();
  //endregion
  //region block: exports
  function $jsExportAll$(_) {
    var $com = _.com || (_.com = {});
    var $com$agroerp = $com.agroerp || ($com.agroerp = {});
    var $com$agroerp$geo = $com$agroerp.geo || ($com$agroerp.geo = {});
    defineProp($com$agroerp$geo, 'Geo', Geo_getInstance);
  }
  $jsExportAll$(_);
  //endregion
  return _;
}));

//# sourceMappingURL=AgroErpMobile-geo-shared.js.map
