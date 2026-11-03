/*
 * TotK cooking engine - JavaScript port of totk_cook_logic.py
 * Cooking code retrieved by dt12345, base code by KingFoo,
 * improved code by Echocolat, additional testing by Doge229.
 * The port keeps the reference arithmetic intact (including Python's
 * round-half-to-even) so the results match the game.
 */

  'use strict';

  var FAILURE_RECIPE = {
    ResultActorName: 'Item_Cook_O_01',
    PictureBookNum: 145,
    CookFailure: true
  };

  // Python's round(): ties go to the even number. JS Math.round() rounds .5 up,
  // which would shift Extra Hearts / Gloom Recovery levels by a whole heart.
  function pyRound(x) {
    var f = Math.floor(x), d = x - f;
    if (d > 0.5) return f + 1;
    if (d < 0.5) return f;
    return (f % 2 === 0) ? f : f + 1;
  }

  function get(obj, key, def) {
    return (obj && obj[key] !== undefined && obj[key] !== null) ? obj[key] : def;
  }

  function pad2(n) {
    n = Math.trunc(n);
    return (n < 10 ? '0' : '') + n;
  }

  function timeStr(seconds) {
    var m = Math.floor(seconds / 60);
    return pad2(m) + ':' + pad2(seconds - 60 * m);
  }

  function EmptyMaterialListError(msg) { this.name = 'EmptyMaterialList'; this.message = msg; }
  function InvalidMaterialError(msg) { this.name = 'InvalidMaterial'; this.message = msg; }

  function TotKCookSim(data) {
    this.data = data;
    this.system_data = data.system;
    this.recipes = data.recipes;
    this.recipes_single = data.single;
    this.recipe_card_table = data.cards;
    this.lang = data.lang;

    this.material = {};
    for (var i = 0; i < data.materials.length; i++) {
      this.material[data.materials[i].ActorName] = data.materials[i];
    }

    // insertion order matters: effects are evaluated in EffectData order
    this.effect = {};
    for (var j = 0; j < data.effects.length; j++) {
      this.effect[data.effects[j].EffectType] = data.effects[j];
    }

    // display name -> actor name, so callers can pass either one
    this._index_material_name = {};
    for (var k = 0; k < data.ingredients.length; k++) {
      this._index_material_name[data.ingredients[k].name] = data.ingredients[k].actor;
    }
  }

  TotKCookSim.prototype._resetFlags = function () {
    this._monster_extract_time_flag = false;
    this._monster_extract_only_health_up_flag = false;
    this._monster_extract_only_health_random_flag = false;
    this._monster_extract_health_level_random_flag = false;
    this._monster_extract_only_level_flag = false;
    this._monster_extract_flag = false;

    this._critical_only_time_flag = false;
    this._critical_only_health_flag = false;
    this._critical_health_level_flag = false;
    this._critical_health_time_flag = false;
    this._critical_health_level_time_flag = false;
    this._critical_level_time_flag = false;
    this._critical_only_level_flag = false;
    this._critical_flag = false;
  };

  TotKCookSim.prototype.cook = function (materials) {
    if (!materials || materials.length === 0) {
      throw new EmptyMaterialListError('Material list is empty');
    }
    this._resetFlags();
    this._tmp = {};
    this.output = {};

    this._material(materials);
    if (this._recipe()) {
      this._effect();
      this._hitpoint_recover();

      if (get(this._tmp.Recipe, 'CookFailure', false)) {
        this._set_failure();
      } else {
        this._monster_extract();

        if (!this._monster_extract_flag) {
          this._super_success_rate();
          this._critical();
        } else {
          this._tmp.SuperSuccessRate = 0;
        }

        this._spice();
        this._bonus_and_adjust();
        this._sell_price();
      }
    } else {
      this._no_match_found();
    }

    this._finish();
    return this.output;
  };

  TotKCookSim.prototype._material = function (materials) {
    var list = [];
    for (var i = 0; i < materials.length; i++) {
      var name = materials[i];
      var actor = this.material[name] ? name : this._index_material_name[name];
      if (!actor || !this.material[actor]) {
        throw new InvalidMaterialError('Invalid material: ' + name);
      }
      list.push(this.material[actor]);
    }
    this._tmp.Materials = list;
  };

  TotKCookSim.prototype._recipe = function () {
    var materials_list = this._tmp.Materials;
    var materials_name_tag = [];
    var seen = {};
    var i, j, recipe, m_copy, parts_list, or_part, material;

    // unique (actor, cooktag) pairs
    for (i = 0; i < materials_list.length; i++) {
      var pair = [materials_list[i].ActorName, materials_list[i].CookTag];
      var key = pair[0] + '|' + pair[1];
      if (!seen[key]) { seen[key] = true; materials_name_tag.push(pair); }
    }

    if (materials_name_tag.length === 1) {
      // single-material recipes
      for (i = 0; i < this.recipes_single.length; i++) {
        recipe = this.recipes_single[i];
        m_copy = materials_name_tag.slice();
        parts_list = recipe.Recipe.split(' or ');
        for (j = 0; j < parts_list.length; j++) {
          or_part = parts_list[j];
          material = m_copy[0];
          if (or_part === material[0] || or_part === material[1]) {
            this._tmp.Recipe = recipe;
            return true;
          }
        }
      }
    } else {
      for (i = 0; i < this.recipes.length; i++) {
        recipe = this.recipes[i];
        m_copy = materials_name_tag.slice();
        if (recipe.ResultActorName === this.system_data.FailActorName) {
          this._tmp.Recipe = recipe;
        }
        var and_parts = recipe.Recipe.split(' + ');
        parts_list = [];
        for (j = 0; j < and_parts.length; j++) parts_list.push(and_parts[j].split(' or '));
        // more required parts than materials: this recipe cannot match
        if (parts_list.length > materials_name_tag.length) continue;

        var all_ok = true;
        for (j = 0; j < parts_list.length; j++) {
          var and_part = parts_list[j];
          var and_ok = false;
          for (var o = 0; o < and_part.length; o++) {
            or_part = and_part[o];
            for (var index = 0; index < m_copy.length; index++) {
              material = m_copy[index];
              if (or_part === material[0] || or_part === material[1]) {
                m_copy.splice(index, 1);
                and_ok = true;
                break;
              }
            }
            if (and_ok) break;
          }
          if (!and_ok) { all_ok = false; break; }
        }
        if (all_ok) {
          this._tmp.Recipe = recipe;
          return true;
        }
      }
    }

    // no normal recipe: a CookSpice material lets the game fall back to single recipes
    var tags = {}, tagCount = 0, hasSpice = false;
    for (i = 0; i < materials_name_tag.length; i++) {
      if (!tags[materials_name_tag[i][1]]) { tags[materials_name_tag[i][1]] = true; tagCount++; }
      if (materials_name_tag[i][1] === 'CookSpice') hasSpice = true;
    }
    if (hasSpice && tagCount >= 2) {
      for (i = 0; i < this.recipes_single.length; i++) {
        recipe = this.recipes_single[i];
        m_copy = materials_name_tag.slice();
        parts_list = recipe.Recipe.split(' or ');
        for (j = 0; j < parts_list.length; j++) {
          or_part = parts_list[j];
          material = m_copy[0];
          if (or_part === material[0] || or_part === material[1]) {
            this._tmp.Recipe = recipe;
            return true;
          }
        }
      }
    }

    return false;
  };

  TotKCookSim.prototype._no_match_found = function () {
    this._tmp = {
      Materials: this._tmp.Materials,
      Recipe: FAILURE_RECIPE,
      Effect: null,
      EffectLevel: 0,
      EffectTime: 0,
      SellingPrice: 2,
      HitPointRecover: this.system_data.SubtleLifeRecover,
      SuperSuccessRate: 0
    };
  };

  TotKCookSim.prototype._effect = function () {
    var materials_list = this._tmp.Materials;
    var recipe = this._tmp.Recipe;
    var set_effect_flag = false;
    var effect_level = 0, effect_type = null, effect_time = 0;
    var bonus_time = 0, bonus_yellow_hearts = 0, bonus_stamina = 0;
    var i, mat;

    // CookEnemy spice applies before Monster Extract and criticals
    for (i = 0; i < materials_list.length; i++) {
      mat = materials_list[i];
      if (get(mat, 'CookTag', null) === 'CookEnemy') {
        bonus_time += get(mat, 'SpiceBoostEffectiveTime', 0);
        bonus_yellow_hearts += get(mat, 'SpiceBoostMaxHeartLevel', 0);
        bonus_stamina += get(mat, 'SpiceBoostStaminaLevel', 0);
      }
    }

    for (var effect in this.effect) {
      if (!Object.prototype.hasOwnProperty.call(this.effect, effect)) continue;

      var effect_materials_num = 0;
      for (i = 0; i < materials_list.length; i++) {
        if (get(materials_list[i], 'CureEffectType', 'None') === effect) effect_materials_num++;
      }
      if (effect_materials_num > 0) {
        // a meal carries one effect only; a second one wipes the values
        if (set_effect_flag) {
          effect_level = 0;
          effect_type = null;
          effect_time = 0;
        } else {
          effect_type = effect;
        }

        var potency_sum = 0;
        effect_time += bonus_time;
        for (i = 0; i < materials_list.length; i++) {
          mat = materials_list[i];
          if (get(mat, 'CureEffectType', 'None') === effect) potency_sum += get(mat, 'CureEffectLevel', 0);
          effect_time += 30;
        }
        effect_time += effect_materials_num * get(this.effect[effect], 'BaseTime', 0);
        effect_level += get(this.effect[effect], 'Rate', 0) * potency_sum;

        if (effect_type === 'LifeMaxUp') effect_level += bonus_yellow_hearts;
        else if (effect_type === 'StaminaRecovery' || effect_type === 'ExStaminaMaxUp') effect_level += bonus_stamina;

        effect_level = Math.min(effect_level, this.effect[effect].MaxLv);
        set_effect_flag = true;
      }
    }

    // an elixir without an effect (or with clashing ones) is a failed meal
    if (get(recipe, 'CookEMedicine', false) && effect_type === null) {
      recipe = FAILURE_RECIPE;
      this._tmp.Recipe = FAILURE_RECIPE;
    }

    if (recipe.ResultActorName === this.system_data.FairyActorName ||
        recipe.ResultActorName === this.system_data.FailActorName ||
        recipe.ResultActorName === 'Item_Cook_O_02') {
      effect_type = null;
      effect_level = 0.0;
      effect_time = 0;
    }

    if (effect_type === 'LifeMaxUp' || effect_type === 'StaminaRecover' ||
        effect_type === 'ExStaminaMaxUp' || effect_type === 'LifeRepair') {
      effect_time = 0;
    }

    this._tmp.Effect = effect_type;
    this._tmp.EffectLevel = effect_level;
    this._tmp.EffectTime = effect_time;
  };

  TotKCookSim.prototype._hitpoint_recover = function () {
    var materials_list = this._tmp.Materials;
    var recipe = this._tmp.Recipe;
    var hitpoint_recover = 0;
    for (var i = 0; i < materials_list.length; i++) {
      hitpoint_recover += get(materials_list[i], 'HitPointRecover', 0);
    }
    var rate = (recipe.ResultActorName === this.system_data.FailActorName || recipe.ResultActorName === 'Item_Cook_O_02')
      ? this.system_data.SubtleLifeRecoverRate
      : this.system_data.LifeRecoverRate;
    this._tmp.HitPointRecover = hitpoint_recover * rate;
  };

  TotKCookSim.prototype._set_failure = function () {
    if (this._tmp.Recipe.ResultActorName === this.system_data.FailActorName) {
      this._tmp.HitPointRecover = Math.max(this.system_data.SubtleLifeRecover, this._tmp.HitPointRecover);
    } else {
      this._tmp.HitPointRecover = this.system_data.FailLifeRecover;
    }
    this._tmp.Effect = null;
    this._tmp.EffectLevel = 0;
    this._tmp.EffectTime = 0;
    this._tmp.SellingPrice = 2;
    this._tmp.SuperSuccessRate = 0;
  };

  TotKCookSim.prototype._monster_extract = function () {
    var materials_list = this._tmp.Materials;
    var effect = this._tmp.Effect;
    var effect_level = this._tmp.EffectLevel;
    var effect_time = this._tmp.EffectTime;
    var hitpoint_recover = this._tmp.HitPointRecover;

    for (var i = 0; i < materials_list.length; i++) {
      if (get(materials_list[i], 'ActorName', null) === this.system_data.EnemyExtractActorName) {
        this._monster_extract_flag = true;
      }
    }
    if (!this._monster_extract_flag) return;

    this._tmp['Monster Extract'] = {};
    if (effect !== null && effect_time > 0) {
      // duration is rerolled to 1:00, 10:00 or 30:00
      this._monster_extract_time_flag = true;
      this._tmp['Monster Extract'].EffectTime = [60, 600, 1800];
    }

    var lifeSSAV = this.effect.LifeRecover.SuperSuccessAddVolume;

    if ((hitpoint_recover === 0 && effect !== null) || effect === 'LifeMaxUp') {
      // not regenerative but has an effect, or hearty: level is set to min or gets SSAV
      this._monster_extract_only_level_flag = true;
      this._tmp['Monster Extract'].EffectLevel = [
        this.effect[effect].MinLv,
        effect_level,
        effect_level + this.effect[effect].SuperSuccessAddVolume
      ];
    } else if (hitpoint_recover === 0 && effect === null) {
      this._monster_extract_only_health_up_flag = true;
      this._tmp['Monster Extract'].HitPointRecover = hitpoint_recover + lifeSSAV;
    } else if (effect !== null) {
      this._monster_extract_health_level_random_flag = true;
      this._tmp['Monster Extract'].HitPointRecover = [1, hitpoint_recover, hitpoint_recover + lifeSSAV];
      this._tmp['Monster Extract'].EffectLevel = [
        this.effect[effect].MinLv,
        effect_level,
        effect_level + this.effect[effect].SuperSuccessAddVolume
      ];
    } else {
      this._monster_extract_only_health_random_flag = true;
      this._tmp['Monster Extract'].HitPointRecover = [1, hitpoint_recover, hitpoint_recover + lifeSSAV];
    }
  };

  TotKCookSim.prototype._super_success_rate = function () {
    var materials_list = this._tmp.Materials;
    var unique = {}, uniqueCount = 0;
    this._tmp.SuperSuccessRate = 0;

    for (var i = 0; i < materials_list.length; i++) {
      this._tmp.SuperSuccessRate = Math.max(this._tmp.SuperSuccessRate, get(materials_list[i], 'SpiceBoostSuccessRate', 0));
      if (!unique[materials_list[i].ActorName]) { unique[materials_list[i].ActorName] = true; uniqueCount++; }
    }
    var list = this.system_data.SuperSuccessRateList;
    for (var j = 0; j < list.length; j++) {
      if (list[j].MaterialTypeNum === uniqueCount) {
        this._tmp.SuperSuccessRate += list[j].Rate;
        return;
      }
    }
  };

  TotKCookSim.prototype._critical = function () {
    var effect = this._tmp.Effect;
    var effect_level = this._tmp.EffectLevel;
    var effect_time = this._tmp.EffectTime;
    var hitpoint_recover = this._tmp.HitPointRecover;
    var lifeSSAV = this.effect.LifeRecover.SuperSuccessAddVolume;
    var lifeMax = this.effect.LifeRecover.MaxLv;
    var addTime = this.system_data.SuperSuccessAddEffectiveTime;

    this._critical_flag = true;
    this._tmp.Critical = {};

    // unlike Monster Extract, a crit guarantees the level ends up above 1
    if (effect_level <= 1.0) {
      effect_level = 1.0;
      this._tmp.EffectLevel = 1.0;
    }

    if (effect === null) {
      this._critical_only_health_flag = true;
      this._tmp.Critical.HitPointRecover = [hitpoint_recover, hitpoint_recover + lifeSSAV];
    } else if (effect === 'LifeMaxUp') {
      this._critical_only_level_flag = true;
      this._tmp.Critical.EffectLevel = [effect_level, effect_level + this.effect[effect].SuperSuccessAddVolume];
    } else if (effect === 'StaminaRecover' || effect === 'ExStaminaMaxUp') {
      if (effect_level >= this.effect[effect].MaxLv) {
        this._critical_only_health_flag = true;
        this._tmp.Critical.HitPointRecover = [hitpoint_recover, hitpoint_recover + lifeSSAV];
      } else {
        this._critical_health_level_flag = true;
        this._tmp.Critical.HitPointRecover = [hitpoint_recover, hitpoint_recover + lifeSSAV];
        this._tmp.Critical.EffectLevel = [effect_level, effect_level + this.effect[effect].SuperSuccessAddVolume];
      }
    } else if (effect_level >= this.effect[effect].MaxLv) {
      if (hitpoint_recover >= lifeMax) {
        this._critical_only_time_flag = true;
        this._tmp.Critical.EffectTime = [effect_time, effect_time + addTime];
      } else {
        this._critical_health_time_flag = true;
        this._tmp.Critical.HitPointRecover = [hitpoint_recover, hitpoint_recover + lifeSSAV];
        this._tmp.Critical.EffectTime = [effect_time, effect_time + addTime];
      }
    } else if (hitpoint_recover >= lifeMax) {
      this._critical_level_time_flag = true;
      this._tmp.Critical.EffectLevel = [effect_level, effect_level + this.effect[effect].SuperSuccessAddVolume];
      this._tmp.Critical.EffectTime = [effect_time, effect_time + addTime];
    } else {
      this._critical_health_level_time_flag = true;
      this._tmp.Critical.HitPointRecover = [hitpoint_recover, hitpoint_recover + lifeSSAV];
      this._tmp.Critical.EffectLevel = [effect_level, effect_level + this.effect[effect].SuperSuccessAddVolume];
      this._tmp.Critical.EffectTime = [effect_time, effect_time + addTime];
    }
  };

  TotKCookSim.prototype._spice = function () {
    var effect = this._tmp.Effect;
    var materials_list = this._tmp.Materials;
    var effect_level = this._tmp.EffectLevel;
    var effect_time = this._tmp.EffectTime;
    var hitpoint_recover = this._tmp.HitPointRecover;
    var i, k;

    // spice applies once per unique material (last occurrence wins, as in the reference)
    var uniq = {}, order = [];
    for (i = 0; i < materials_list.length; i++) {
      if (uniq[materials_list[i].ActorName] === undefined) order.push(materials_list[i].ActorName);
      uniq[materials_list[i].ActorName] = materials_list[i];
    }

    for (k = 0; k < order.length; k++) {
      var material = uniq[order[k]];

      if (get(material, 'CookTag', null) !== 'CookEnemy') {
        var hpBoost = get(material, 'SpiceBoostHitPointRecover', 0);
        if (this._critical_health_level_flag || this._critical_health_level_time_flag ||
            this._critical_health_time_flag || this._critical_only_health_flag) {
          this._tmp.Critical.HitPointRecover = [
            this._tmp.Critical.HitPointRecover[0] + hpBoost,
            this._tmp.Critical.HitPointRecover[1] + hpBoost
          ];
        } else if (this._monster_extract_health_level_random_flag || this._monster_extract_only_health_random_flag) {
          this._tmp['Monster Extract'].HitPointRecover = [
            this._tmp['Monster Extract'].HitPointRecover[0] + hpBoost,
            this._tmp['Monster Extract'].HitPointRecover[1] + hpBoost,
            this._tmp['Monster Extract'].HitPointRecover[2] + hpBoost
          ];
        }
        hitpoint_recover += hpBoost;

        var timeBoost = get(material, 'SpiceBoostEffectiveTime', 0);
        if (this._critical_only_time_flag || this._critical_health_time_flag ||
            this._critical_health_level_time_flag || this._critical_level_time_flag) {
          this._tmp.Critical.EffectTime = [
            this._tmp.Critical.EffectTime[0] + timeBoost,
            this._tmp.Critical.EffectTime[1] + timeBoost
          ];
        } else if (this._monster_extract_time_flag) {
          this._tmp['Monster Extract'].EffectTime = [
            this._tmp['Monster Extract'].EffectTime[0] + timeBoost,
            this._tmp['Monster Extract'].EffectTime[1] + timeBoost,
            this._tmp['Monster Extract'].EffectTime[2] + timeBoost
          ];
        }
        effect_time += timeBoost;
      }

      if (get(material, 'CookTag', null) === 'CookSpice') {
        if (effect === 'LifeMaxUp') {
          var heartBoost = get(material, 'SpiceBoostMaxHeartLevel', 0);
          if (this._critical_only_level_flag || this._critical_health_level_flag ||
              this._critical_health_level_time_flag || this._critical_level_time_flag) {
            this._tmp.Critical.EffectLevel = [
              this._tmp.Critical.EffectLevel[0] + heartBoost,
              this._tmp.Critical.EffectLevel[1] + heartBoost
            ];
          } else if (this._monster_extract_health_level_random_flag || this._monster_extract_only_level_flag) {
            this._tmp['Monster Extract'].EffectLevel = [
              this._tmp['Monster Extract'].EffectLevel[0] + heartBoost,
              this._tmp['Monster Extract'].EffectLevel[1] + heartBoost,
              this._tmp['Monster Extract'].EffectLevel[2] + heartBoost
            ];
          }
          effect_level += heartBoost;
        } else if (effect === 'StaminaRecover' || effect === 'ExStaminaMaxUp') {
          var stamBoost = get(material, 'SpiceBoostStaminaLevel', 0);
          if (this._critical_only_level_flag || this._critical_health_level_flag ||
              this._critical_health_level_time_flag || this._critical_level_time_flag) {
            this._tmp.Critical.EffectLevel = [
              this._tmp.Critical.EffectLevel[0] + stamBoost,
              this._tmp.Critical.EffectLevel[1] + stamBoost
            ];
          } else if (this._monster_extract_health_level_random_flag || this._monster_extract_only_level_flag) {
            this._tmp['Monster Extract'].EffectLevel = [
              this._tmp['Monster Extract'].EffectLevel[0] + stamBoost,
              this._tmp['Monster Extract'].EffectLevel[1] + stamBoost,
              this._tmp['Monster Extract'].EffectLevel[2] + stamBoost
            ];
          }
          effect_level += stamBoost;
        }
      }
    }

    this._tmp.EffectLevel = effect_level;
    this._tmp.EffectTime = effect_time;
    this._tmp.HitPointRecover = hitpoint_recover;
  };

  TotKCookSim.prototype._bonus_and_adjust = function () {
    var recipe = this._tmp.Recipe;
    var effect = this._tmp.Effect;
    var bonusTime = get(recipe, 'BonusTime', 0);
    var bonusHeart = get(recipe, 'BonusHeart', 0);
    var lifeMax = this.effect.LifeRecover.MaxLv;
    var me = this._tmp['Monster Extract'];
    var crit = this._tmp.Critical;
    var i;

    // duration bonus
    if (this._monster_extract_time_flag) {
      for (i = 0; i < 3; i++) me.EffectTime[i] = Math.min(me.EffectTime[i] + bonusTime, 1800);
    } else if (this._critical_only_time_flag || this._critical_health_time_flag || this._critical_health_level_time_flag) {
      for (i = 0; i < 2; i++) crit.EffectTime[i] = Math.min(crit.EffectTime[i] + bonusTime, 1800);
    }
    this._tmp.EffectTime = Math.min(this._tmp.EffectTime + bonusTime, 1800);

    // health bonus
    if (this._critical_health_level_flag || this._critical_health_level_time_flag ||
        this._critical_health_time_flag || this._critical_only_health_flag) {
      for (i = 0; i < 2; i++) {
        crit.HitPointRecover[i] = Math.min(120, crit.HitPointRecover[i] + bonusHeart);
        if (crit.HitPointRecover[i] === 120) crit.HitPointRecover[i] = lifeMax;
      }
      if (effect === 'LifeMaxUp') crit.HitPointRecover = [lifeMax, lifeMax];
      if (effect === null) {
        for (i = 0; i < 2; i++) if (crit.HitPointRecover[i] === 0) crit.HitPointRecover[i] = 1;
      }
    } else if (this._monster_extract_health_level_random_flag || this._monster_extract_only_health_random_flag) {
      for (i = 0; i < 3; i++) {
        me.HitPointRecover[i] = Math.min(120, me.HitPointRecover[i] + bonusHeart);
        if (me.HitPointRecover[i] === 120) me.HitPointRecover[i] = lifeMax;
      }
      if (effect === 'LifeMaxUp') me.HitPointRecover = [lifeMax, lifeMax, lifeMax];
      if (effect === null) {
        for (i = 0; i < 3; i++) if (me.HitPointRecover[i] === 0) me.HitPointRecover[i] = 1;
      }
    }

    this._tmp.HitPointRecover = Math.min(120, this._tmp.HitPointRecover + bonusHeart);
    if (this._tmp.HitPointRecover === 120) this._tmp.HitPointRecover = lifeMax;
    if (effect === null && this._tmp.HitPointRecover === 0) this._tmp.HitPointRecover = 1;

    // effect level clamping
    if (effect) {
      var maxLv = this.effect[effect].MaxLv;
      var wholeHeartEffect = (effect === 'LifeMaxUp' || effect === 'LifeRepair');

      if (this._monster_extract_only_level_flag || this._monster_extract_health_level_random_flag) {
        for (i = 0; i < 3; i++) {
          me.EffectLevel[i] = Math.min(maxLv, me.EffectLevel[i]);
          if (me.EffectLevel[i] <= 1.0 && me.EffectLevel[i] > 0) me.EffectLevel[i] = 1.0;
        }
        if (wholeHeartEffect) {
          for (i = 0; i < 3; i++) {
            me.EffectLevel[i] = 4 * pyRound(me.EffectLevel[i] / 4);
            if (me.EffectLevel[i] <= 4.0 && me.EffectLevel[i] > 0) me.EffectLevel[i] = 4;
          }
        }
        for (i = 0; i < 3; i++) me.EffectLevel[i] = Math.floor(me.EffectLevel[i]);
      } else if (this._critical_health_level_flag || this._critical_health_level_time_flag ||
                 this._critical_only_level_flag || this._critical_level_time_flag) {
        for (i = 0; i < 2; i++) {
          crit.EffectLevel[i] = Math.min(maxLv, crit.EffectLevel[i]);
          if (crit.EffectLevel[i] <= 1.0 && crit.EffectLevel[i] > 0) crit.EffectLevel[i] = 1.0;
        }
        if (wholeHeartEffect) {
          for (i = 0; i < 2; i++) {
            crit.EffectLevel[i] = 4 * pyRound(crit.EffectLevel[i] / 4);
            if (crit.EffectLevel[i] <= 4.0 && crit.EffectLevel[i] > 0) crit.EffectLevel[i] = 4;
          }
        }
        for (i = 0; i < 2; i++) crit.EffectLevel[i] = Math.floor(crit.EffectLevel[i]);
      }

      this._tmp.EffectLevel = Math.min(maxLv, this._tmp.EffectLevel);
      if (this._tmp.EffectLevel <= 1.0 && this._tmp.EffectLevel > 0) this._tmp.EffectLevel = 1.0;
      if (wholeHeartEffect) {
        this._tmp.EffectLevel = 4 * pyRound(this._tmp.EffectLevel / 4);
        if (this._tmp.EffectLevel <= 4.0 && this._tmp.EffectLevel > 0) this._tmp.EffectLevel = 4;
      }
      this._tmp.EffectLevel = Math.floor(this._tmp.EffectLevel);
    }
  };

  TotKCookSim.prototype._sell_price = function () {
    var materials_list = this._tmp.Materials;
    var selling_price = 0, i;

    for (i = 0; i < materials_list.length; i++) {
      if (get(materials_list[i], 'CookLowPrice', false)) selling_price += 1;
      else selling_price += get(materials_list[i], 'SellingPrice', 0);
    }

    var list = this.system_data.PriceRateList;
    for (i = 0; i < list.length; i++) {
      if (list[i].MaterialNum === materials_list.length) {
        this._tmp.SellingPrice = Math.floor(selling_price * list[i].Rate);
      }
    }

    this._tmp.SellingPrice = Math.max(this._tmp.SellingPrice, 3);
    var actor = this._tmp.Recipe.ResultActorName;
    if (actor === 'Item_Cook_O_02' || actor === this.system_data.SubtleLifeRecover || actor === this.system_data.FairyActorName) {
      this._tmp.SellingPrice = 2;
    }
  };

  TotKCookSim.prototype._finish = function () {
    var rng = '';
    var actor = this._tmp.Recipe.ResultActorName;
    var effect = this._tmp.Effect;
    var me = this._tmp['Monster Extract'];
    var crit = this._tmp.Critical;
    var lifeSSAV = this.effect.LifeRecover.SuperSuccessAddVolume;
    var lifeMax = this.effect.LifeRecover.MaxLv;

    var locale_actor_name = this.lang.Meal[actor + '_Name'] || actor;
    var locale_buff_name = '';
    var locale_meal_name = locale_actor_name;

    if (effect) {
      locale_meal_name = (this.lang.Effect[effect + '_Name'] || '') + ' ' + locale_actor_name;
      locale_buff_name = this.lang.Buff[effect] || '';
    }
    if (!locale_buff_name) locale_buff_name = 'None';

    var crit_time_string = timeStr(this.system_data.SuperSuccessAddEffectiveTime);

    // duration RNG
    if (this._monster_extract_time_flag) {
      rng += 'Monster Extract sets time to ' + timeStr(me.EffectTime[0]) + ', ' + timeStr(me.EffectTime[1]) +
             ' or ' + timeStr(me.EffectTime[2]) + ' (each 33.3%)';
    } else if (this._critical_only_time_flag || this._critical_health_time_flag ||
               this._critical_health_level_time_flag || this._critical_level_time_flag) {
      rng += "If there's a critical hit, duration gets a " + crit_time_string + ' increase';
    }

    var effect_time_str = timeStr(this._tmp.EffectTime);

    // health RNG
    var quarter_map = ['', '¼', '½', '¾'];
    if (this._monster_extract_only_health_random_flag || this._monster_extract_health_level_random_flag) {
      var hp0 = me.HitPointRecover[0];
      var whole0 = Math.trunc(Math.floor(hp0 / 4));
      var quarter0 = Math.trunc(hp0 - 4 * Math.floor(hp0 / 4));
      var heart_str0;
      if (effect === 'LifeMaxUp' || hp0 === 120.0) {
        heart_str0 = '♥ Full Recovery';
      } else {
        heart_str0 = new Array(Math.max(0, whole0) + 1).join('♥');
        if (quarter0) heart_str0 += quarter_map[quarter0] + '♥';
      }
      if (heart_str0 === '') heart_str0 = 'None';
      if (this._tmp.HitPointRecover + Math.trunc(lifeSSAV / 4) >= 120) {
        rng += 'Monster Extract sets health recovery to ' + heart_str0 + ', either adds Full Recovery';
      } else {
        rng += 'Monster Extract sets health recovery to ' + heart_str0 + ', either adds ' + Math.trunc(lifeSSAV / 4) + ' Hearts';
      }
    } else if (this._critical_only_health_flag || this._critical_health_level_flag ||
               this._critical_health_level_time_flag || this._critical_health_time_flag) {
      if (this._tmp.HitPointRecover + lifeSSAV >= 120) {
        rng += "If there's a critical hit, adds Full Recovery";
      } else {
        rng += "If there's a critical hit, adds " + Math.trunc(lifeSSAV / 4) + ' Hearts';
      }
    }

    // hearts
    var heart_amount = Math.round((this._tmp.HitPointRecover / 4) * 100) / 100;
    var heart_str;
    if (effect === 'LifeMaxUp' || this._tmp.HitPointRecover === lifeMax) heart_str = 'Full Recovery';
    else if (heart_amount === 0) heart_str = 'None';
    else if (heart_amount < 2) heart_str = heart_amount + ' Heart';
    else heart_str = heart_amount + ' Hearts';

    // effect level
    var level_str;
    var meLvl = (this._monster_extract_only_level_flag || this._monster_extract_health_level_random_flag);
    var critLvl = (this._critical_only_level_flag || this._critical_health_level_flag ||
                   this._critical_health_level_time_flag || this._critical_level_time_flag);

    if (effect === 'LifeMaxUp') {
      if (meLvl) {
        rng += 'Monster Extract sets meal effect to ' + Math.trunc(me.EffectLevel[0] / 4) +
               ' Extra Heart, either adds ' + Math.trunc((me.EffectLevel[2] - me.EffectLevel[1]) / 4) +
               " Extra Heart to the meal effect'";
      } else if (critLvl) {
        rng += "If there's a critical hit, adds " + Math.trunc((crit.EffectLevel[1] - crit.EffectLevel[0]) / 4) +
               ' Extra Heart to the meal effect';
      }
      level_str = Math.trunc(this._tmp.EffectLevel / 4) + ' Extra Heart(s)';
      effect_time_str = 'None';
    } else if (effect === 'StaminaRecover') {
      if (meLvl) {
        rng += 'Monster Extract sets meal effect to ' + me.EffectLevel[0] + ' Stamina Segment, either adds ' +
               (me.EffectLevel[2] - me.EffectLevel[1]) + ' Stamina Segments to the meal effect';
      } else if (critLvl) {
        rng += "If there's a critical hit, adds " + (crit.EffectLevel[1] - crit.EffectLevel[0]) +
               ' Stamina Segments to the meal effect';
      }
      level_str = Math.trunc(this._tmp.EffectLevel) + ' Stamina Segment(s)';
      effect_time_str = 'None';
    } else if (effect === 'ExStaminaMaxUp') {
      if (meLvl) {
        rng += 'Monster Extract sets meal effect to ' + me.EffectLevel[0] + ' Extra Stamina Segment, either adds ' +
               (me.EffectLevel[2] - me.EffectLevel[1]) + ' Extra Stamina Segments to the meal effect';
      } else if (critLvl) {
        rng += "If there's a critical hit, adds " + (crit.EffectLevel[1] - crit.EffectLevel[0]) +
               ' Extra Stamina Segments to the meal effect';
      }
      level_str = Math.trunc(this._tmp.EffectLevel) + ' Extra Stamina Segment(s)';
      effect_time_str = 'None';
    } else if (effect === 'LifeRepair') {
      if (meLvl) {
        rng += 'Monster Extract sets meal effect to ' + Math.trunc(me.EffectLevel[0] / 4) + ' Ungloomed Heart, either adds ' +
               Math.trunc((me.EffectLevel[2] - me.EffectLevel[1]) / 4) + ' Ungloomed Heart to the meal effect';
      } else if (critLvl) {
        rng += "If there's a critical hit, adds " + Math.trunc((crit.EffectLevel[1] - crit.EffectLevel[0]) / 4) +
               ' Ungloomed Heart to the meal effect';
      }
      level_str = Math.trunc(this._tmp.EffectLevel / 4) + ' Ungloomed Hearts';
      effect_time_str = 'None';
    } else {
      if (meLvl) {
        rng += 'Monster Extract sets effect level to ' + me.EffectLevel[0] + ', either adds ' +
               (me.EffectLevel[2] - me.EffectLevel[1]) + ' level(s) to the effect';
      } else if (critLvl) {
        rng += "If there's a critical hit, adds " + (crit.EffectLevel[1] - crit.EffectLevel[0]) + ' level(s) to the effect';
      }
      level_str = String(this._tmp.EffectLevel);
    }

    // description
    var locale_actor_caption = this.lang.Meal[actor + '_Caption'] || '';
    var locale_effect_desc = '';
    if (effect) {
      var key = effect + (actor === 'Item_Cook_C_17' ? '_MedicineDesc' : '_Desc');
      if (this.effect[effect].MaxLv <= 3 && this._tmp.EffectLevel > 1) {
        key += '_' + pad2(this._tmp.EffectLevel);
      }
      locale_effect_desc = this.lang.Effect[key] || '';
    }
    var meal_desc = (locale_effect_desc + '\n' + locale_actor_caption).trim();

    var recipe_number = this._tmp.Recipe.PictureBookNum;
    if (actor === 'Item_Cook_C_17') {
      recipe_number = this.recipe_card_table.indexOf(actor + '_' + this._tmp.Effect) + 1;
    }

    var effect_label = (locale_buff_name + ' (' + (effect !== null ? effect : '') + ')').replace(' ()', '');
    if (effect_label === 'None') {
      effect_time_str = 'None';
      level_str = 'None';
    }

    // RNG sentence assembly (several possibilities are merged into one line)
    var rngText = '';
    if (rng) {
      if (rng.indexOf("If there's a critical hit, ") !== -1) {
        var cparts = rng.split("If there's a critical hit, ");
        rngText = "If there's a critical hit, ";
        if (cparts.length - 1 === 1) rngText += cparts[1];
        else if (cparts.length - 1 === 2) rngText += 'either ' + cparts[1] + ', either ' + cparts[2];
        else rngText += 'either ' + cparts[1] + ', either ' + cparts[2] + ', either ' + cparts[3];
      } else {
        var mparts = rng.split('Monster Extract ');
        rngText = 'Monster Extract ';
        if (this._monster_extract_time_flag) {
          if (mparts.length - 1 === 1) rngText += mparts[1];
          else rngText += mparts[1] + ' and, either ' + mparts[2];
        } else {
          if (mparts.length - 1 === 1) rngText += 'either ' + mparts[1];
          else rngText += 'either ' + mparts[1] + ', either ' + mparts[2];
        }
      }
    }

    this.output = {
      mealName: locale_meal_name,
      actorName: actor,
      recipeNumber: recipe_number,
      healthRecovery: heart_str,
      effect: effect_label,
      effectType: effect,
      effectDuration: effect_time_str,
      effectLevel: level_str,
      criticalRate: Math.min(this._tmp.SuperSuccessRate, 100),
      sellPrice: this._tmp.SellingPrice,
      description: meal_desc.replace(/\n/g, ' '),
      rng: rngText,
      isFailure: !!get(this._tmp.Recipe, 'CookFailure', false),
      raw: {
        hitPointRecover: this._tmp.HitPointRecover,
        effectLevelValue: this._tmp.EffectLevel,
        effectTimeValue: this._tmp.EffectTime
      }
    };
  };

  TotKCookSim.EmptyMaterialListError = EmptyMaterialListError;
  TotKCookSim.InvalidMaterialError = InvalidMaterialError;

export default TotKCookSim;
